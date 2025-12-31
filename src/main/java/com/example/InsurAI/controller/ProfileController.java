package com.example.InsurAI.controller;

import com.example.InsurAI.dto.ProfileDto;
import com.example.InsurAI.dto.ProfileUpdateRequest;
import com.example.InsurAI.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<ProfileDto> getMyProfile(Authentication authentication) {
        Long userId = extractUserId(authentication);
        ProfileDto dto = profileService.getProfileForUser(userId);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileDto> updateMyProfile(
            Authentication authentication,
            @RequestBody ProfileUpdateRequest request
    ) {
        Long userId = extractUserId(authentication);
        ProfileDto dto = profileService.updateProfile(userId, request);
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
