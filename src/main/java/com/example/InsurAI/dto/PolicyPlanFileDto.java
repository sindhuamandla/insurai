package com.example.InsurAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class PolicyPlanFileDto {
    private Long policyId;
    private String fileName;
    private String contentType;
    private long fileSizeBytes;
    private LocalDateTime uploadedAt;
}
