package com.executr.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity 
@Data
@Table(name = "user_stats")
public class UserStats {
    @Id
    private Long userId; // Shares the exact same ID as the User

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private int totalSolved = 0;
    private int easySolved = 0;
    private int mediumSolved = 0;
    private int hardSolved = 0;
    private int globalRank = 0; // Can be updated nightly by a scheduled batch job
}
