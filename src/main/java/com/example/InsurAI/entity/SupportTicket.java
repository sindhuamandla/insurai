package com.example.InsurAI.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "support_tickets")
@Getter
@Setter
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who created the ticket (customer/agent/admin)
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_support_ticket_user"))
    private User user;

    @Column(length = 150, nullable = false)
    private String subject;

    @Column(length = 64, nullable = false)
    private String category; // e.g. APPOINTMENT, PLAN, PAYMENT, OTHER

    // Optional override if user types different name/email in the form
    @Column(length = 128)
    private String contactName;

    @Column(length = 128)
    private String contactEmail;

    @Column(length = 32)
    private String contactPhone;

    @Column(length = 4000, nullable = false)
    private String message;

    // Path or filename of uploaded attachment, if any
    @Column(length = 512)
    private String attachmentPath;

    @Column(length = 32, nullable = false)
    private String status; // OPEN, IN_PROGRESS, RESOLVED

    @Column(length = 4000)
    private String lastAdminResponse;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
