package com.example.InsurAI.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoleDemoController {

    @GetMapping("/api/test/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public String customerOnly() {
        return "Hello CUSTOMER";
    }

    @GetMapping("/api/test/agent")
    @PreAuthorize("hasRole('AGENT')")
    public String agentOnly() {
        return "Hello AGENT";
    }

    @GetMapping("/api/test/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminOnly() {
        return "Hello ADMIN";
    }

    @GetMapping("/api/test/any")
    @PreAuthorize("hasAnyRole('CUSTOMER','AGENT','ADMIN')")
    public String anyAuthenticated() {
        return "Hello authenticated user";
    }
}
