package com.executr.dto.response;

public class CodeExecutionResponse {
    private String output;
    private String error;

    public CodeExecutionResponse(String output, String error) {
        this.output = output;
        this.error = error;
    }

    // Getters
    public String getOutput() {
        return output;
    }

    public String getError() {
        return error;
    }
}
