package com.executr.controller;

import com.executr.dto.request.SolutionValidationRequest;
import com.executr.dto.response.SolutionValidationResponse;
import com.executr.service.SolutionValidationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/problems/public")
public class SolutionValidationController {

    private final SolutionValidationService validationService;

    public SolutionValidationController(SolutionValidationService validationService) {
        this.validationService = validationService;
    }

    @PostMapping("/validate-solution")
    public ResponseEntity<SolutionValidationResponse> validateSolution(@RequestBody SolutionValidationRequest request) {
        SolutionValidationResponse response = validationService.validateSolution(request);
        return ResponseEntity.ok(response);
    }
}