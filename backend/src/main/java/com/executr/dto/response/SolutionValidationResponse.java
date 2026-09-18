package com.executr.dto.response;

public class SolutionValidationResponse {
    private boolean allPassed;
    private Integer failedIndex;
    private String errorMessage;
    private String actualOutput;
    private String expectedOutput;

    public SolutionValidationResponse(boolean allPassed) {
        this.allPassed = allPassed;
    }

    public static SolutionValidationResponse success() {
        return new SolutionValidationResponse(true);
    }

    public static SolutionValidationResponse failure(int failedIndex, String errorMessage, String actualOutput, String expectedOutput) {
        SolutionValidationResponse resp = new SolutionValidationResponse(false);
        resp.failedIndex = failedIndex;
        resp.errorMessage = errorMessage;
        resp.actualOutput = actualOutput;
        resp.expectedOutput = expectedOutput;
        return resp;
    }

    // Getters
    public boolean isAllPassed() { return allPassed; }
    public Integer getFailedIndex() { return failedIndex; }
    public String getErrorMessage() { return errorMessage; }
    public String getActualOutput() { return actualOutput; }
    public String getExpectedOutput() { return expectedOutput; }
}