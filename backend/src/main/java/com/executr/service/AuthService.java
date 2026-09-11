package com.executr.service;

import com.executr.entity.User;
import com.executr.repository.UserRepository;
import com.executr.security.JwtService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    public String authenticateWithGoogle(String googleToken) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken idToken = verifier.verify(googleToken);
        if (idToken == null) {
            throw new IllegalArgumentException("Invalid Google token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();

        // Find existing user or create a new one
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            // Default username logic (frontend modal will update this later)
            newUser.setUsername(email.split("@")[0]); 
            newUser.setAvatarUrl((String) payload.get("picture"));
            return userRepository.save(newUser);
        });

        return jwtService.generateToken(user);
    }
}