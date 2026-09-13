package com.executr.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "problem_proposals")
public class ProblemProposal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Problem.Difficulty difficulty;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descriptionMarkdown;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProposalStatus status = ProposalStatus.PENDING;

    @Column(nullable = false, updatable = false)
    private String submitterIp;

    private String adminFeedback;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "proposal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProposalTestCase> testCases = new ArrayList<>();

    public enum ProposalStatus {
        PENDING, APPROVED, REJECTED
    }
}