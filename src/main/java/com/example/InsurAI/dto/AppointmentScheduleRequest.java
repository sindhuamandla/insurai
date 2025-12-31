package com.example.InsurAI.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentScheduleRequest {

    // chosen agent
    private Long agentId;

    // chosen availability slot
    private Long availabilityId;

    // ISO datetime if needed explicitly, e.g. 2025-12-10T10:00
    private String scheduledAt;

    private String reason;
    private String notes;
}
