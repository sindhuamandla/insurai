package com.example.InsurAI.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupportTicketReplyRequest {

    private String replyMessage;
    private String newStatus; // e.g. IN_PROGRESS or RESOLVED
}
