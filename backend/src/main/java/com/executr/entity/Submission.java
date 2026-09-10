package com.executr.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(
    name = "submissions",
    indexes = {
        // Crucial composite index to quickly check if a user has solved a specific problem before
        @Index(name = "idx_user_problem_status", columnList = "user_id, problem_id, status")
    }
)
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(nullable = false)
    private String language;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private Integer executionTimeMs;
    private Integer memoryUsedKb;

    private LocalDateTime submittedAt = LocalDateTime.now();

    public enum Status {
        ACCEPTED, 
        WRONG_ANSWER, 
        TIME_LIMIT_EXCEEDED, 
        MEMORY_LIMIT_EXCEEDED, 
        RUNTIME_ERROR, 
        COMPILATION_ERROR
    }
}
