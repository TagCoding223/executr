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
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${app.security.admin-email:your-email@gmail.com}") 
    private String adminEmail;

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

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(email.split("@")[0]); 
            newUser.setAvatarUrl((String) payload.get("picture"));
            
            // Assign ADMIN role if the email matches the whitelist
            if (email.equalsIgnoreCase(adminEmail)) {
                newUser.setRole(User.Role.ADMIN);
            } else {
                newUser.setRole(User.Role.USER);
            }
            
            return userRepository.save(newUser);
        });

        // Add the role to the JWT claims so the React frontend knows the user's role
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        
        return jwtService.generateToken(claims, user);
    }
}