package com.example.InsurAI.dto;

import com.example.InsurAI.entity.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRoleRequest {
    private UserRole role;
}
