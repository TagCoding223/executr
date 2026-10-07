package com.executr.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.executr.dto.request.ProposalRequestDto;
import com.executr.service.ProblemProposalService;
import com.executr.service.RateLimitingService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/problems/public")
@RequiredArgsConstructor
public class ProblemProposalController {

    private final RateLimitingService rateLimitingService;
    private final ProblemProposalService problemProposalService;

    @PostMapping("/propose")
    public ResponseEntity<?> submitProposal(@RequestBody ProposalRequestDto requestDto, HttpServletRequest request) {
        String clientIp = rateLimitingService.extractClientIp(request);

        if (!rateLimitingService.isAllowedToSubmit(clientIp)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Rate limit exceeded: You can only submit 3 proposals per 24 hours.");
        }

        // Delegate business logic to the service
        problemProposalService.createAndSaveProposal(requestDto, clientIp);

        return ResponseEntity.ok("Submission received! Your problem is queued for review.");
    }
}