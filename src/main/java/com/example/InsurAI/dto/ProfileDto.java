package com.example.InsurAI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDto {
    private Long id;
    private String name;
    private String email;
    private String role;

    private String phone;
    private String location;
    private String bio;
    private Integer experienceYears;
    private String companyName;
    private String specialties;
}
