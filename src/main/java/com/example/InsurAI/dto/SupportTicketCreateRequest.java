package com.example.InsurAI.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupportTicketCreateRequest {

    private String subject;
    private String category;
    private String name;
    private String email;
    private String phone;
    private String message;
    // attachment will be handled as MultipartFile in controller
}
