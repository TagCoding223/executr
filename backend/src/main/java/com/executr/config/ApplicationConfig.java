package com.executr.config;

import com.executr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        // Assuming email is used as the primary username for authentication
        return username -> userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    // Optional: Add this if you ever plan to do standard Email/Password logins
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        // In Spring Security 7, UserDetailsService must be injected via constructor
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService());
        
        // Ensure the password encoder is set (even if we only use Google OAuth right now)
        authProvider.setPasswordEncoder(passwordEncoder()); 
        
        return authProvider;
    }
}