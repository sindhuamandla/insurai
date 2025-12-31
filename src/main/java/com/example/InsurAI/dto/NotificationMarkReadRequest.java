package com.example.InsurAI.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NotificationMarkReadRequest {
    private List<Long> ids;
}
