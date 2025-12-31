package com.example.InsurAI.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AiAssistantService {

    private final Client geminiClient;

    @Value("${gemini.model.name}")
    private String modelName;

    public AiAssistantService(Client geminiClient) {
        this.geminiClient = geminiClient;
    }

    public String chat(String userMessage) {
        String systemPrompt =
                "You are InsurAI, a helpful corporate insurance assistant. " +
                        "Answer briefly and clearly about policies, appointments and plans.";

        String fullPrompt = systemPrompt + "\n\nUser: " + userMessage;

        GenerateContentResponse response =
                geminiClient.models.generateContent(
                        modelName,
                        fullPrompt,
                        null
                );

        String text = response.text();
        return text != null ? text.trim() : "";
    }
}
