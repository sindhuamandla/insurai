package com.example.InsurAI.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "profiles",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_profiles_user", columnNames = "user_id")
        }
)
@Getter
@Setter
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_profiles_user"))
    private User user;

    @Column(length = 255)
    private String location;

    @Column(length = 512)
    private String bio;

    private Integer experienceYears;

    @Column(length = 255)
    private String specialties;

    @Column(length = 255)
    private String companyName;

    private Boolean notifyApptInApp;
    private Boolean notifyApptEmail;
    private Boolean notifyApptSms;
    private Boolean notifyPromoEmail;

    @Column(length = 32)
    private String accentColor;

    @Column(length = 32)
    private String dateFormat;

    @Column(length = 32)
    private String timeFormat;

    @PrePersist
    public void applyDefaults() {
        if (notifyApptInApp == null) notifyApptInApp = Boolean.TRUE;
        if (notifyApptEmail == null) notifyApptEmail = Boolean.TRUE;
        if (notifyApptSms == null) notifyApptSms = Boolean.FALSE;
        if (notifyPromoEmail == null) notifyPromoEmail = Boolean.FALSE;
        if (accentColor == null) accentColor = "teal";
        if (dateFormat == null) dateFormat = "DD-MM-YYYY";
        if (timeFormat == null) timeFormat = "24h";
    }
}
