package com.executr.controller;

import com.executr.dto.request.TokenRequest;
import com.executr.dto.response.AuthResponse;
import com.executr.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody TokenRequest request) {
        try {
            String jwt = authService.authenticateWithGoogle(request.getToken());
            return ResponseEntity.ok(new AuthResponse(jwt));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}