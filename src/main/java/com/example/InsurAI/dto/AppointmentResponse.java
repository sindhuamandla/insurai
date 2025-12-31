package com.example.InsurAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AppointmentResponse {

    private Long id;
    private Long customerId;
    private Long agentId;
    private Long availabilityId;
    private String scheduledAt;
    private String status;
    private String reason;
    private String notes;

    private String customerName;
    private String agentName;

    public AppointmentResponse(
            Long id,
            Long customerId,
            Long agentId,
            Long availabilityId,
            String scheduledAt,
            String status,
            String reason,
            String notes
    ) {
        this.id = id;
        this.customerId = customerId;
        this.agentId = agentId;
        this.availabilityId = availabilityId;
        this.scheduledAt = scheduledAt;
        this.status = status;
        this.reason = reason;
        this.notes = notes;
        this.customerName = "";
        this.agentName = "";
    }
}
