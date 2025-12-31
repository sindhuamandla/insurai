package com.example.InsurAI.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "policy_plans")
@Getter
@Setter
public class PolicyPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 60)
    private String category; // CAR, BIKE, LIFE, HEALTH, etc.

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal premiumAmount;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal coverageAmount;

    @Column(nullable = false)
    private boolean active = true;

    @Column(length = 500)
    private String description;

    // =============== FILE STORAGE FIELDS ===============
    @Column(length = 255)
    private String fileName; // e.g., "policy_document.pdf"

    @Column(name = "file_content", columnDefinition = "LONGBLOB")
    private byte[] fileContent; // Binary data of the file (max ~4GB in MySQL)

    @Column(length = 50)
    private String fileContentType; // e.g., "application/pdf"

    @Column(name = "file_uploaded_at")
    private LocalDateTime fileUploadedAt; // Track when file was uploaded

    @Column(length = 100)
    private String fileOriginalName; // Original name uploaded by user

    // ====================================================

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
