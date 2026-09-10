package com.executr.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // We can use a secure random UUID instead of a JWT for refresh tokens
    @Column(nullable = false, unique = true)
    private String token = UUID.randomUUID().toString();

    @Column(nullable = false)
    private Instant expiryDate;

    private boolean revoked = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}