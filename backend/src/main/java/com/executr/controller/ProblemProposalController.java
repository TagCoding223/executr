package com.executr.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.executr.repository.ProblemProposalRepository;
import com.executr.service.RateLimitingService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import com.executr.dto.request.ProposalRequestDto;
import com.executr.entity.ProblemProposal;
import com.executr.entity.ProposalTestCase;

@RestController
@RequestMapping("/api/problems/public")
@RequiredArgsConstructor
public class ProblemProposalController {

    private final RateLimitingService rateLimitingService;
    private final ProblemProposalRepository proposalRepository;

    @PostMapping("/propose")
    @Transactional
    public ResponseEntity<?> submitProposal(@RequestBody ProposalRequestDto requestDto, HttpServletRequest request) {
        String clientIp = rateLimitingService.extractClientIp(request);

        if (!rateLimitingService.isAllowedToSubmit(clientIp)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Rate limit exceeded: You can only submit 3 proposals per 24 hours.");
        }

        ProblemProposal proposal = new ProblemProposal();
        proposal.setTitle(requestDto.getTitle());
        // Generate a URL-friendly slug from the title (e.g., "Two Sum" -> "two-sum")
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

        return ResponseEntity.ok("Submission received! Your problem is queued for review.");
    }
}