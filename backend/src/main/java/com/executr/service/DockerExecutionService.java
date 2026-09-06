package com.executr.service;

import org.springframework.stereotype.Service;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

@Service
public class DockerExecutionService {

    public String executeJavaCode(String sourceCode) {
        Path tempDir = null;
        try {
            // 1. Create a temporary directory for this execution
            tempDir = Files.createTempDirectory("executr_java_");
            
            // 2. Write the user code to a file
            File sourceFile = tempDir.resolve("Solution.java").toFile();
            Files.writeString(sourceFile.toPath(), sourceCode);

            // 3. Write test cases to an input file
            File inputFile = tempDir.resolve("input.txt").toFile();
            Files.writeString(inputFile.toPath(), "10 20\n30 40\n"); // Example test data

            // 4. Build the secure Docker command
            // Note: We pipe the input.txt file directly into the Java process
            ProcessBuilder processBuilder = new ProcessBuilder(
                "docker", "run", "--rm",
                "--network", "none",       // Prevent internet access
                "--memory", "512m",        // Limit RAM
                "--cpus", "1.0",           // Limit CPU
                "-v", tempDir.toAbsolutePath() + ":/workspace",
                "-w", "/workspace",
                "eclipse-temurin:21-jdk",         // Official Java image
                "sh", "-c", "javac Solution.java && java Solution < input.txt"
            );

            // 5. Execute the process and capture output
            Process process = processBuilder.start();
            
            // Capture standard output
            String output = new String(process.getInputStream().readAllBytes());
            // Capture standard error (compilation errors, exceptions)
            String error = new String(process.getErrorStream().readAllBytes());

            // Enforce a strict 5-second timeout
            boolean finished = process.waitFor(5, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return "Error: Execution Timed Out (Possible Infinite Loop)";
            }

            if (!error.isEmpty()) {
                return "Error:\n" + error;
            }
            return output;

        } catch (Exception e) {
            return "System Error: " + e.getMessage();
        } finally {
            // 6. Clean up the temporary directory
            if (tempDir != null) {
                deleteDirectory(tempDir.toFile());
            }
        }
    }

    // Helper method to recursively delete the temporary folder
    private void deleteDirectory(File directoryToBeDeleted) {
        File[] allContents = directoryToBeDeleted.listFiles();
        if (allContents != null) {
            for (File file : allContents) {
                deleteDirectory(file);
            }
        }
        directoryToBeDeleted.delete();
    }
}