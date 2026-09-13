package com.executr.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.executr.entity.Problem;
import com.executr.entity.ProblemProposal;
import com.executr.entity.TestCase;
import com.executr.repository.ProblemProposalRepository;
import com.executr.repository.ProblemRepository;
import com.executr.repository.TestCaseRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProblemProposalRepository proposalRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;

    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("pending", proposalRepository.countByStatus(ProblemProposal.ProposalStatus.PENDING));
        stats.put("approved", proposalRepository.countByStatus(ProblemProposal.ProposalStatus.APPROVED));
        stats.put("rejected", proposalRepository.countByStatus(ProblemProposal.ProposalStatus.REJECTED));
        return stats;
    }

    public List<ProblemProposal> getPendingProposals() {
        return proposalRepository.findAllByStatusOrderByCreatedAtAsc(ProblemProposal.ProposalStatus.PENDING);
    }

    @Transactional
    public void approveProposal(Long proposalId) {
        ProblemProposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        if (proposal.getStatus() != ProblemProposal.ProposalStatus.PENDING) {
            throw new IllegalStateException("Proposal is not in a pending state.");
        }

        // 1. Create the Live Problem
        Problem liveProblem = new Problem();
        liveProblem.setTitle(proposal.getTitle());
        liveProblem.setSlug(proposal.getSlug());
        liveProblem.setDifficulty(proposal.getDifficulty());
        liveProblem.setDescription(proposal.getDescriptionMarkdown());
        problemRepository.save(liveProblem);

        // 2. Migrate Test Cases
        List<TestCase> liveTestCases = proposal.getTestCases().stream().map(ptc -> {
            TestCase tc = new TestCase();
            tc.setInputData(ptc.getInputData());
            tc.setExpectedOutput(ptc.getExpectedOutput());
            tc.setSample(ptc.isSample());
            tc.setProblem(liveProblem);
            return tc;
        }).collect(Collectors.toList());
        testCaseRepository.saveAll(liveTestCases);

        // 3. Mark Proposal as Approved
        proposal.setStatus(ProblemProposal.ProposalStatus.APPROVED);
        proposalRepository.save(proposal);
    }

    @Transactional
    public void rejectProposal(Long proposalId, String feedback) {
        ProblemProposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        proposal.setStatus(ProblemProposal.ProposalStatus.REJECTED);
        proposal.setAdminFeedback(feedback);
        proposalRepository.save(proposal);
    }
}