package com.example.InsurAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PolicyPlanCreateUpdateRequest {
    private String name;
    private String category;
    private BigDecimal premiumAmount;
    private BigDecimal coverageAmount;
    private boolean active;
    private String description;
    // NO file field here - files handled separately via multipart
}
