package com.example.InsurAI.controller;

import com.example.InsurAI.dto.AiChatRequest;
import com.example.InsurAI.dto.AiChatResponse;
import com.example.InsurAI.service.AiAssistantService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    public AiAssistantController(AiAssistantService aiAssistantService) {
        this.aiAssistantService = aiAssistantService;
    }

    @PostMapping("/chat")
    @PreAuthorize("isAuthenticated()") // CUSTOMER, AGENT, or ADMIN
    public AiChatResponse chat(@RequestBody AiChatRequest request) {
        String reply = aiAssistantService.chat(
                request.getMessage() == null ? "" : request.getMessage().trim()
        );
        return new AiChatResponse(reply);
    }
}
