package com.executr.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.executr.dto.request.RejectRequest;
import com.executr.entity.ProblemProposal;
import com.executr.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/proposals/pending")
    public ResponseEntity<List<ProblemProposal>> getPendingProposals() {
        return ResponseEntity.ok(adminService.getPendingProposals());
    }

    @PostMapping("/proposals/{id}/approve")
    public ResponseEntity<?> approveProposal(@PathVariable Long id) {
        adminService.approveProposal(id);
        return ResponseEntity.ok(Map.of("message", "Problem approved and published successfully."));
    }

    @PostMapping("/proposals/{id}/reject")
    public ResponseEntity<?> rejectProposal(@PathVariable Long id, @RequestBody RejectRequest request) {
        adminService.rejectProposal(id, request.getFeedback());
        return ResponseEntity.ok(Map.of("message", "Problem proposal rejected."));
    }
}

