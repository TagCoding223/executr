package com.executr.entity;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity 
@Data
@Table(name = "users")
public class User implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    // Added for Spring Security compatibility (even if using OAuth primarily)
    private String password;

    private String location;
    
    private String avatarUrl;

    public enum Role {
        USER,
        ADMIN
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // One-to-One mapping to the highly optimized stats table
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserStats stats;

    // ========================================================================
    // Spring Security UserDetails Methods
    // ========================================================================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Dynamically assign the role based on the database field
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        // Since we lookup users by email in ApplicationConfig, we return email here.
        // This ensures the JWT subject maps perfectly to the UserDetailsService.
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Set to false if you want to implement account expiration
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Set to false if you want to implement ban/lock logic
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true; // Set to false for email verification flows
    }
}
