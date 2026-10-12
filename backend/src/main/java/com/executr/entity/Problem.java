package com.executr.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    // Added fields to match proposals upon approval
    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Column
    private String solutionLanguage;

    @Column(columnDefinition = "TEXT")
    private String solutionCode;

    @Column(nullable = false)
    private Long totalAttempts = 0L;

    @Column(nullable = false)
    private Long successfulAttempts = 0L;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestCase> testCases = new ArrayList<>();

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }
}