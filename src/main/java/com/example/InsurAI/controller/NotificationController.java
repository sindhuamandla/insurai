package com.example.InsurAI.controller;

import com.example.InsurAI.dto.NotificationResponse;
import com.example.InsurAI.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Get all notifications for current user
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(
            Authentication authentication
    ) {
        Long userId = extractUserId(authentication);
        List<NotificationResponse> list = notificationService.getMyNotifications(userId);
        return ResponseEntity.ok(list);
    }

    /**
     * Mark single notification as read
     */
    @PostMapping("/mark-read")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('AGENT') or hasRole('ADMIN')")
    public ResponseEntity<Void> markAsRead(
            Authentication authentication,
            @RequestBody MarkReadRequest req
    ) {
        Long userId = extractUserId(authentication);
        notificationService.markNotificationAsRead(userId, req.getNotificationId());
        return ResponseEntity.ok().build();
    }

    /**
     * Mark all notifications as read
     */
    @PostMapping("/mark-all-read")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('AGENT') or hasRole('ADMIN')")
    public ResponseEntity<Void> markAllAsRead(
            Authentication authentication
    ) {
        Long userId = extractUserId(authentication);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Extract user ID from authentication
     */
    private Long extractUserId(Authentication authentication) {
        if (authentication == null) {
            throw new IllegalStateException("Unauthenticated");
        }
        Object details = authentication.getDetails();
        if (details instanceof Long) {
            Long id = (Long) details;
            return id;
        }
        throw new IllegalStateException("User id not present in authentication");
    }

    /**
     * Inner DTO class for mark read request
     */
    public static class MarkReadRequest {
        private Long notificationId;

        public Long getNotificationId() {
            return notificationId;
        }

        public void setNotificationId(Long notificationId) {
            this.notificationId = notificationId;
        }
    }
}
