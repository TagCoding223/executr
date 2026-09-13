package com.executr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.executr.entity.ProblemProposal;
import com.executr.entity.ProblemProposal.ProposalStatus;

@Repository
public interface ProblemProposalRepository extends JpaRepository<ProblemProposal, Long> {

    Long countByStatus(ProposalStatus pending);

    List<ProblemProposal> findAllByStatusOrderByCreatedAtAsc(ProposalStatus pending);
}
