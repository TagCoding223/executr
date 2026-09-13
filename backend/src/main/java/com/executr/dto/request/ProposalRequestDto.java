package com.executr.dto.request;

import com.executr.entity.Problem.Difficulty;
import lombok.Data;
import java.util.List;

@Data
public class ProposalRequestDto {
    private String title;
    private Difficulty difficulty;
    private String descriptionMarkdown;
    private List<TestCaseDto> testCases;

    @Data
    public static class TestCaseDto {
        private String inputData;
        private String expectedOutput;
        private boolean isSample;
    }
}

