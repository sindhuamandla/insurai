package com.example.InsurAI.controller;

import com.example.InsurAI.dto.SupportTicketCreateRequest;
import com.example.InsurAI.dto.SupportTicketReplyRequest;
import com.example.InsurAI.dto.SupportTicketResponse;
import com.example.InsurAI.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SupportController {

    private final SupportService supportService;

    // CUSTOMER / AGENT: submit support request
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('AGENT') or hasRole('ADMIN')")
    public ResponseEntity<SupportTicketResponse> createTicket(
            Authentication authentication,
            @ModelAttribute SupportTicketCreateRequest request,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment
    ) {
        Long userId = extractUserId(authentication);
        SupportTicketResponse resp = supportService.createTicket(userId, request, attachment);
        return ResponseEntity.ok(resp);
    }

    // CUSTOMER / AGENT: list own tickets
    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('AGENT') or hasRole('ADMIN')")
    public ResponseEntity<List<SupportTicketResponse>> getMyTickets(Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(supportService.getMyTickets(userId));
    }

    // ADMIN: list all tickets
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SupportTicketResponse>> getAllTickets() {
        return ResponseEntity.ok(supportService.getAllTickets());
    }

    // ADMIN: reply to ticket
    @PostMapping("/admin/{ticketId}/reply")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SupportTicketResponse> replyToTicket(
            Authentication authentication,
            @PathVariable Long ticketId,
            @RequestBody SupportTicketReplyRequest request
    ) {
        Long adminId = extractUserId(authentication);
        SupportTicketResponse resp = supportService.replyToTicket(ticketId, request, adminId);
        return ResponseEntity.ok(resp);
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
