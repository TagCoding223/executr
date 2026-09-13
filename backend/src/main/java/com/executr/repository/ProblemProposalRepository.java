package com.executr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.executr.entity.ProblemProposal;

@Repository
public interface ProblemProposalRepository extends JpaRepository<ProblemProposal, Long> {
}
