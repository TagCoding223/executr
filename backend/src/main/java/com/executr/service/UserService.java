package com.executr.service;

import com.executr.dto.response.UserProfileResponse;
import com.executr.entity.Problem;
import com.executr.entity.User;
import com.executr.entity.UserStats;
import com.executr.repository.ProblemRepository;
import com.executr.repository.SubmissionRepository;
import com.executr.repository.UserRepository;
import com.executr.repository.UserStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserStatsRepository userStatsRepository;
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;

    public UserProfileResponse getUserProfile(String emailOrUsername) {
        User user = userRepository.findByEmail(emailOrUsername)
                .or(() -> userRepository.findByUsername(emailOrUsername))
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch or initialize user stats
        UserStats stats = userStatsRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    UserStats defaultStats = new UserStats();
                    defaultStats.setUserId(user.getId());
                    defaultStats.setEasySolved(0);
                    defaultStats.setMediumSolved(0);
                    defaultStats.setHardSolved(0);
                    defaultStats.setTotalSolved(0);
                    defaultStats.setGlobalRank(9999);
                    return userStatsRepository.save(defaultStats);
                });

        // Get total available problems per difficulty for progress bar percentages
        long totalEasy = problemRepository.countByDifficulty(Problem.Difficulty.EASY);
        long totalMedium = problemRepository.countByDifficulty(Problem.Difficulty.MEDIUM);
        long totalHard = problemRepository.countByDifficulty(Problem.Difficulty.HARD);

        UserProfileResponse response = new UserProfileResponse();
        response.setName(user.getUsername());
        response.setUsername("@" + user.getUsername());
        response.setEmail(user.getEmail());
        response.setJoinDate(user.getCreatedAt() != null ? "Joined " + user.getCreatedAt().format(DateTimeFormatter.ofPattern("MMMM yyyy")) : "Joined recently");
        response.setLocation(user.getLocation() != null ? user.getLocation() : "Remote / India");
        response.setAvatar(user.getAvatarUrl() != null ? user.getAvatarUrl() : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.getUsername());

        UserProfileResponse.StatsDto statsDto = new UserProfileResponse.StatsDto();
        statsDto.setRank(stats.getGlobalRank());
        statsDto.setTotalSolved(stats.getTotalSolved());

        UserProfileResponse.DifficultyStat easy = new UserProfileResponse.DifficultyStat();
        easy.setSolved(stats.getEasySolved());
        easy.setTotal(totalEasy > 0 ? totalEasy : 1);
        statsDto.setEasy(easy);

        UserProfileResponse.DifficultyStat medium = new UserProfileResponse.DifficultyStat();
        medium.setSolved(stats.getMediumSolved());
        medium.setTotal(totalMedium > 0 ? totalMedium : 1);
        statsDto.setMedium(medium);

        UserProfileResponse.DifficultyStat hard = new UserProfileResponse.DifficultyStat();
        hard.setSolved(stats.getHardSolved());
        hard.setTotal(totalHard > 0 ? totalHard : 1);
        statsDto.setHard(hard);

        response.setStats(statsDto);

        // Fetch recent submissions
        var submissions = submissionRepository.findTop10ByUserIdOrderBySubmittedAtDesc(user.getId());
        List<UserProfileResponse.SubmissionDto> subDtos = submissions.stream().map(sub -> {
            UserProfileResponse.SubmissionDto dto = new UserProfileResponse.SubmissionDto();
            dto.setId(sub.getId());
            dto.setTitle(sub.getProblem() != null ? sub.getProblem().getTitle() : "Algorithm Problem");
            dto.setDifficulty(sub.getProblem() != null ? sub.getProblem().getDifficulty().name() : "EASY");
            dto.setLanguage(sub.getLanguage());
            dto.setStatus(sub.getStatus().name());
            dto.setTime(sub.getSubmittedAt() != null ? sub.getSubmittedAt().toString() : "Recently");
            return dto;
        }).collect(Collectors.toList());

        response.setRecentSubmissions(subDtos);
        return response;
    }
}