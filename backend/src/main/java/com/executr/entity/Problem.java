package com.executr.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

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
    private String slug; // e.g., "two-sum" for the URL

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    // Cache total attempts and successes to calculate acceptance rate easily
    private long totalAttempts = 0;
    private long successfulAttempts = 0;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }
}
