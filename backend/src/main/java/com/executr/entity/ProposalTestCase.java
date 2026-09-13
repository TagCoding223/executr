package com.executr.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "proposal_test_cases")
public class ProposalTestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String inputData;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String expectedOutput;

    private boolean isSample = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposal_id", nullable = false)
    @JsonIgnore
    private ProblemProposal proposal;
}