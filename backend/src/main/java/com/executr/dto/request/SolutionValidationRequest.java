package com.executr.dto.request;

import java.util.List;

public class SolutionValidationRequest {
    private String language; // "java", "cpp", "python", "javascript"
    private String code;
    private List<TestCaseDto> testCases;

    // Getters and Setters
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public List<TestCaseDto> getTestCases() { return testCases; }
    public void setTestCases(List<TestCaseDto> testCases) { this.testCases = testCases; }

    public static class TestCaseDto {
        private String input;
        private String expectedOutput;

        public String getInput() { return input; }
        public void setInput(String input) { this.input = input; }
        public String getExpectedOutput() { return expectedOutput; }
        public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }
    }
}