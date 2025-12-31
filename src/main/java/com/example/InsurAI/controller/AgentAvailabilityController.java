package com.example.InsurAI.controller;

import com.example.InsurAI.dto.AgentAvailabilityRequest;
import com.example.InsurAI.dto.AgentAvailabilityResponse;
import com.example.InsurAI.service.AgentAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AgentAvailabilityController {

    private final AgentAvailabilityService availabilityService;

    @GetMapping("/my")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<List<AgentAvailabilityResponse>> getMyAvailability(Authentication authentication) {
        Long agentId = extractUserId(authentication);
        List<AgentAvailabilityResponse> list = availabilityService.getMyAvailabilities(agentId);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/my")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<AgentAvailabilityResponse> createAvailability(
            Authentication authentication,
            @RequestBody AgentAvailabilityRequest req
    ) {
        Long agentId = extractUserId(authentication);
        System.out.println("DEBUG createAvailability agentId=" + agentId +
                " date=" + req.getDate() +
                " start=" + req.getStartTime() +
                " end=" + req.getEndTime());
        AgentAvailabilityResponse resp = availabilityService.createAvailability(agentId, req);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/public")
    public ResponseEntity<List<AgentAvailabilityResponse>> getOpenSlots(
            @RequestParam("date")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<AgentAvailabilityResponse> list = availabilityService.getOpenSlotsForDate(date);
        return ResponseEntity.ok(list);
    }

    private Long extractUserId(Authentication authentication) {
        if (authentication == null) throw new IllegalStateException("Unauthenticated");
        Object details = authentication.getDetails();
        if (details instanceof Long id) return id;
        throw new IllegalStateException("User id not present in authentication");
    }

    @ExceptionHandler({
            IllegalArgumentException.class,
            IllegalStateException.class
    })
    public ResponseEntity<String> handleAvailabilityErrors(RuntimeException ex) {
        // return 400 with message instead of 500
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
