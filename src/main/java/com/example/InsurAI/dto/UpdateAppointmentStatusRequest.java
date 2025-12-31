package com.example.InsurAI.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAppointmentStatusRequest {
    private String status; // BOOKED, COMPLETED, CANCELLED, PENDING
}
