package com.executr.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.executr.dto.request.ProposalRequestDto;
import com.executr.entity.ProblemProposal;
import com.executr.entity.ProposalTestCase;
import com.executr.repository.ProblemProposalRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProblemProposalService {

    private final ProblemProposalRepository proposalRepository;
    private final RateLimitingService rateLimitingService;

    @Transactional
    public void createAndSaveProposal(ProposalRequestDto requestDto, String clientIp) {
        ProblemProposal proposal = new ProblemProposal();
        proposal.setTitle(requestDto.getTitle());
        // Generate a URL-friendly slug
        proposal.setSlug(requestDto.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        proposal.setDifficulty(requestDto.getDifficulty());
        proposal.setDescriptionMarkdown(requestDto.getDescriptionMarkdown());
        proposal.setSubmitterIp(clientIp);

        List<ProposalTestCase> testCases = requestDto.getTestCases().stream().map(tcDto -> {
            ProposalTestCase tc = new ProposalTestCase();
            tc.setInputData(tcDto.getInputData());
            tc.setExpectedOutput(tcDto.getExpectedOutput());
            tc.setSample(tcDto.isSample());
            tc.setProposal(proposal);
            return tc;
        }).collect(Collectors.toList());

        proposal.setTestCases(testCases);
        proposalRepository.save(proposal);

        // Record the action to enforce the rate limit for future requests
        rateLimitingService.recordSubmission(clientIp, "/api/problems/public/propose");
    }
}