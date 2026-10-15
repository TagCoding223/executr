package com.executr.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class UserProfileResponse {
    private String name;
    private String username;
    private String email;
    private String joinDate;
    private String location;
    private String avatar;
    private StatsDto stats;
    private List<SubmissionDto> recentSubmissions;

    @Data
    public static class StatsDto {
        private long rank;
        private long totalSolved;
        private DifficultyStat easy;
        private DifficultyStat medium;
        private DifficultyStat hard;
    }

    @Data
    public static class DifficultyStat {
        private long solved;
        private long total;
    }

    @Data
    public static class SubmissionDto {
        private Long id;
        private String title;
        private String difficulty;
        private String time;
        private String language;
        private String status;
    }
}