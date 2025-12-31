package com.example.InsurAI.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String name;           // optional – allow rename
    private String phone;
    private String location;
    private String bio;
    private Integer experienceYears;
    private String companyName;
    private String specialties;
}
