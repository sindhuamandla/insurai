package com.example.InsurAI.controller;

import com.example.InsurAI.dto.PolicyPlanDto;
import com.example.InsurAI.service.AdminPolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PlanController {

    private final AdminPolicyService adminPolicyService;

    @GetMapping
    public List<PolicyPlanDto> getActivePlans() {
        return adminPolicyService.listActive();
    }
}
