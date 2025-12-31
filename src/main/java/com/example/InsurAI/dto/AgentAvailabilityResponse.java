package com.example.InsurAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AgentAvailabilityResponse {

    private Long id;
    private String date;
    private String startTime;
    private String endTime;
    private String status;
    private String notes;

    private Long agentId;
    private String agentName;

    public AgentAvailabilityResponse(
            Long id,
            String date,
            String startTime,
            String endTime,
            String status,
            String notes,
            Long agentId,
            String agentName
    ) {
        this.id = id;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.notes = notes;
        this.agentId = agentId;
        this.agentName = agentName;
    }

}
