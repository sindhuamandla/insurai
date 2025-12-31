package com.example.InsurAI.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAgentRequest {

    private String email;

    private String password;

    private String name;

    private String phone;

}
