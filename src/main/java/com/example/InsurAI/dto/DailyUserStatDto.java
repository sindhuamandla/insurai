package com.example.InsurAI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DailyUserStatDto {
    private String date;          // e.g. "2025-12-15"
    private long newCustomers;    // customers created on that date
    private long activeAgents;    // enabled AGENT users on that date (snapshot)
}
