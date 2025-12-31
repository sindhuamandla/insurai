package com.example.InsurAI.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AgentAvailabilityRequest {

    private String date;      // ISO string: 2025-12-10
    private String startTime; // HH:mm, e.g. 10:00
    private String endTime;   // HH:mm, e.g. 11:00
    private String status;    // optional: OPEN/CLOSED, default OPEN
    private String notes;
}
