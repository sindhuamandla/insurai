package com.example.InsurAI.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.Instant;

@Entity
@Table(
        name = "appointments",
        indexes = {
                @Index(name = "idx_appointments_customer", columnList = "customer_id"),
                @Index(name = "idx_appointments_agent", columnList = "agent_id")
        }
)
@Getter
@Setter
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(
            name = "customer_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_appointments_customer")
    )
    private User customer;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(
            name = "agent_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_appointments_agent")
    )
    private User agent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "availability_id",
            foreignKey = @ForeignKey(name = "fk_appointments_availability")
    )
    private AgentAvailability availability;

    @Column(nullable = false)
    private LocalDateTime scheduledAt;

    @Column(length = 32, nullable = false)
    private String status; // BOOKED, CANCELLED, COMPLETED

    @Column(length = 255)
    private String reason;

    @Column(length = 512)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
}
