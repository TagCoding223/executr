package com.executr.service;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.executr.entity.IpRateLimit;
import com.executr.repository.IpRateLimitRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RateLimitingService {

    private final IpRateLimitRepository ipRateLimitRepository;
    private static final int MAX_PROPOSALS_PER_DAY = 3;

    public String extractClientIp(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }
        // In case of multiple proxies, the first IP is the original client
        if (ipAddress != null && ipAddress.contains(",")) {
            ipAddress = ipAddress.split(",")[0].trim();
        }
        return ipAddress;
    }

    public boolean isAllowedToSubmit(String clientIp) {
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);
        long recentSubmissions = ipRateLimitRepository.countByClientIpAndCreatedAtAfter(clientIp, twentyFourHoursAgo);
        return recentSubmissions < MAX_PROPOSALS_PER_DAY;
    }

    public void recordSubmission(String clientIp, String endpoint) {
        IpRateLimit log = new IpRateLimit();
        log.setClientIp(clientIp);
        log.setEndpoint(endpoint);
        ipRateLimitRepository.save(log);
    }
}