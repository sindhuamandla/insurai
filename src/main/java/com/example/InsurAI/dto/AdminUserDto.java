package com.example.InsurAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AdminUserDto {
    private Long id;
    private String email;
    private String name;
    private String role;
    private boolean enabled;
    private String createdAt;
}
