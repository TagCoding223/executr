package com.executr.service;

import com.executr.dto.request.SolutionValidationRequest;
import com.executr.dto.response.SolutionValidationResponse;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class SolutionValidationService {

    private static final int TIMEOUT_SECONDS = 5; // Prevent infinite loops

    public SolutionValidationResponse validateSolution(SolutionValidationRequest request) {
        String lang = request.getLanguage().toLowerCase();
        String code = request.getCode();
        List<SolutionValidationRequest.TestCaseDto> testCases = request.getTestCases();

        Path tempDir = null;
        try {
            // Create a host-level temporary directory to mount into Docker
            tempDir = Files.createTempDirectory("executr_val_docker_");

            if ("java".equals(lang)) {
                return validateJavaInDocker(tempDir, code, testCases);
            } else if ("python".equals(lang)) {
                return validatePythonInDocker(tempDir, code, testCases);
            } else {
                return SolutionValidationResponse.failure(0, "Unsupported language: " + lang, "", "");
            }

        } catch (Exception e) {
            return SolutionValidationResponse.failure(0, "Docker Execution Exception: " + e.getMessage(), "", "");
        } finally {
            if (tempDir != null) {
                deleteDirectory(tempDir.toFile());
            }
        }
    }

    // ==========================================
    // JAVA EXECUTION PIPELINE IN DOCKER
    // ==========================================
    private SolutionValidationResponse validateJavaInDocker(Path tempDir, String code, List<SolutionValidationRequest.TestCaseDto> testCases) throws Exception {
        // Write Main.java to host temp directory
        Path sourceFile = tempDir.resolve("Main.java");
        Files.writeString(sourceFile, code);

        String absoluteHostPath = tempDir.toAbsolutePath().toString();

        // 1. Compile Java Code inside Container
        List<String> compileCmd = List.of(
            "docker", "run", "--rm",
            "-v", absoluteHostPath + ":/app",
            "-w", "/app",
            "eclipse-temurin:21-jdk",
            "javac", "Main.java"
        );

        Process compileProcess = new ProcessBuilder(compileCmd).start();
        if (!compileProcess.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS)) {
            compileProcess.destroyForcibly();
            return SolutionValidationResponse.failure(0, "Compilation Timeout Error", "", "");
        }

        if (compileProcess.exitValue() != 0) {
            String compileError = new String(compileProcess.getErrorStream().readAllBytes());
            return SolutionValidationResponse.failure(0, "Compilation Error:\n" + compileError, "", "");
        }

        // 2. Run Test Cases in Isolated Container
        for (int i = 0; i < testCases.size(); i++) {
            SolutionValidationRequest.TestCaseDto testCase = testCases.get(i);

            List<String> runCmd = List.of(
                "docker", "run", "--rm", "-i",
                "--network", "none",            // Block network access for security
                "--memory", "256m",             // Limit RAM memory
                "-v", absoluteHostPath + ":/app",
                "-w", "/app",
                "eclipse-temurin:21-jdk",
                "java", "Main"
            );

            SolutionValidationResponse result = executeTestCase(runCmd, testCase, i);
            if (result != null) return result; // Return early on failure
        }

        return SolutionValidationResponse.success();
    }

    // ==========================================
    // PYTHON EXECUTION PIPELINE IN DOCKER
    // ==========================================
    private SolutionValidationResponse validatePythonInDocker(Path tempDir, String code, List<SolutionValidationRequest.TestCaseDto> testCases) throws Exception {
        // Write script.py to host temp directory
        Path sourceFile = tempDir.resolve("script.py");
        Files.writeString(sourceFile, code);

        String absoluteHostPath = tempDir.toAbsolutePath().toString();

        for (int i = 0; i < testCases.size(); i++) {
            SolutionValidationRequest.TestCaseDto testCase = testCases.get(i);

            List<String> runCmd = List.of(
                "docker", "run", "--rm", "-i",
                "--network", "none",
                "--memory", "128m",
                "-v", absoluteHostPath + ":/app",
                "-w", "/app",
                "python:3.10-slim",
                "python", "script.py"
            );

            SolutionValidationResponse result = executeTestCase(runCmd, testCase, i);
            if (result != null) return result;
        }

        return SolutionValidationResponse.success();
    }

    // Helper method to write to stdin, collect outputs, and assert test results
    private SolutionValidationResponse executeTestCase(List<String> command, SolutionValidationRequest.TestCaseDto testCase, int index) throws Exception {
        ProcessBuilder pb = new ProcessBuilder(command);
        Process process = pb.start();

        // Write test case input to container STDIN
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {
            writer.write(testCase.getInput() != null ? testCase.getInput() : "");
            writer.flush();
        }

        // Handle process execution timeout
        if (!process.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS)) {
            process.destroyForcibly();
            return SolutionValidationResponse.failure(index, "Time Limit Exceeded (TLE)", "", testCase.getExpectedOutput());
        }

        String actualOutput = new String(process.getInputStream().readAllBytes()).trim();
        String errOutput = new String(process.getErrorStream().readAllBytes()).trim();

        if (process.exitValue() != 0) {
            return SolutionValidationResponse.failure(index, "Runtime Error:\n" + errOutput, actualOutput, testCase.getExpectedOutput());
        }

        String expected = testCase.getExpectedOutput() != null ? testCase.getExpectedOutput().trim() : "";
        if (!actualOutput.equalsIgnoreCase(expected)) {
            return SolutionValidationResponse.failure(
                index,
                "Output Mismatch on Test Case " + (index + 1),
                actualOutput,
                expected
            );
        }

        return null; // Test case passed
    }

    private void deleteDirectory(File dir) {
        File[] files = dir.listFiles();
        if (files != null) {
            for (File f : files) deleteDirectory(f);
        }
        dir.delete();
    }
}