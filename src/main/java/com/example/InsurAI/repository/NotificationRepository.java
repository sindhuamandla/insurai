package com.example.InsurAI.repository;

import com.example.InsurAI.entity.Notification;
import com.example.InsurAI.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * Find all unread notifications for a user
     * Changed from findByUserAndIsReadFalse to findByUserAndReadFalse
     */
    List<Notification> findByUserAndReadFalse(User user);

    /**
     * Find all notifications for a user, ordered by newest first
     */
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
}
