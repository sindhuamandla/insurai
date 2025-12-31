package com.example.InsurAI.service;

import com.example.InsurAI.dto.NotificationResponse;
import com.example.InsurAI.entity.Notification;
import com.example.InsurAI.entity.User;
import com.example.InsurAI.repository.NotificationRepository;
import com.example.InsurAI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import static com.example.InsurAI.entity.UserRole.ADMIN;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * Create and send notification to a user
     */
    public void notifyUser(Long userId, String type, String title, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setCreatedAt(Instant.now());

        notificationRepository.save(notification);
    }

    /**
     * Get all notifications for current user
     */
    public List<NotificationResponse> getMyNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Mark single notification as read
     */
    @Transactional
    public void markNotificationAsRead(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        // Verify notification belongs to user
        if (!notification.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Notification does not belong to this user");
        }

        if (!notification.isRead()) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    /**
     * Mark all notifications as read for user
     */
    @Transactional
    public void markAllAsRead(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Notification> unreadNotifications = notificationRepository
                .findByUserAndReadFalse(user);

        unreadNotifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }

    /**
     * Convert Notification entity to NotificationResponse DTO
     */
    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getType(),
                n.getTitle(),
                n.getMessage(),
                n.isRead(),
                n.getCreatedAt().toString()
        );
    }

    public void notifyAdminsAboutSupportTicket(String type, String title, String message) {
        List<User> admins = userRepository.findByRole(ADMIN); // add such finder if not present

        for (User admin : admins) {
            notifyUser(admin.getId(), type, title, message);
        }
    }

    public void notifyUserAboutSupportReply(Long userId, String ticketSubject, String replyMessage) {
        String title = "Support reply: " + ticketSubject;
        String message = replyMessage.length() > 200
                ? replyMessage.substring(0, 197) + "..."
                : replyMessage;
        notifyUser(userId, "SUPPORT_REPLY", title, message);
    }

}
