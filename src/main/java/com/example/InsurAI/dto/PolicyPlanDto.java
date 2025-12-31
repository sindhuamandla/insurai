package com.example.InsurAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class PolicyPlanDto {
    private Long id;
    private String name;
    private String category;
    private BigDecimal premiumAmount;
    private BigDecimal coverageAmount;
    private boolean active;
    private String description;

    // File info
    private String fileName;        // Shows if file exists
    private String contentType;     // MIME type
    private LocalDateTime fileUploadedAt; // When uploaded
    private long fileSizeBytes;     // Size in bytes
}
