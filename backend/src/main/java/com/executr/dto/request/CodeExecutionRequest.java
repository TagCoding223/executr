package com.executr.dto.request;

public class CodeExecutionRequest {
    private String language;
    private String sourceCode;

    // Getters and Setters are required for Spring to parse the JSON
    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getSourceCode() {
        return sourceCode;
    }

    public void setSourceCode(String sourceCode) {
        this.sourceCode = sourceCode;
    }
}
