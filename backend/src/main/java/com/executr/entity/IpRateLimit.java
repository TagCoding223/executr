package com.executr.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(
    name = "ip_rate_limits",
    indexes = {@Index(name = "idx_client_ip_time", columnList = "clientIp, createdAt")}
)
public class IpRateLimit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String clientIp;

    @Column(nullable = false)
    private String endpoint;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}