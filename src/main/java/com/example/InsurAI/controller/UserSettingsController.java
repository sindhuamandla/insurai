package com.example.InsurAI.controller;

import com.example.InsurAI.dto.UserSettingsDto;
import com.example.InsurAI.dto.UserSettingsUpdateRequest;
import com.example.InsurAI.service.UserSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    @GetMapping
    public ResponseEntity<UserSettingsDto> getMySettings(Authentication authentication) {
        Long userId = extractUserId(authentication);
        UserSettingsDto dto = userSettingsService.getSettingsForUser(userId);
        return ResponseEntity.ok(dto);
    }

    @PutMapping
    public ResponseEntity<UserSettingsDto> updateMySettings(
            Authentication authentication,
            @RequestBody UserSettingsUpdateRequest request
    ) {
        Long userId = extractUserId(authentication);
        UserSettingsDto dto = userSettingsService.updateSettings(userId, request);
        return ResponseEntity.ok(dto);
    }

    private Long extractUserId(Authentication authentication) {
        if (authentication == null) {
            throw new IllegalStateException("Unauthenticated");
        }
        Object details = authentication.getDetails();
        if (details instanceof Long id) {
            return id;
        }
        throw new IllegalStateException("User id not present in authentication");
    }
}
