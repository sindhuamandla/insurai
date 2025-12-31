package com.example.InsurAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SupportTicketResponse {

    private Long id;
    private String subject;
    private String category;
    private String status;
    private String message;
    private String lastAdminResponse;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private String createdAt;
}
