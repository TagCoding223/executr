package com.executr.repository;

import com.executr.entity.IpRateLimit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

@Repository
public interface IpRateLimitRepository extends JpaRepository<IpRateLimit, Long> {
    long countByClientIpAndCreatedAtAfter(String clientIp, LocalDateTime timestamp);
}
