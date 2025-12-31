package com.example.InsurAI.dto;

import lombok.Data;

@Data
public class UserSettingsUpdateRequest {
    // all optional; when null keep existing
    private Boolean notifyApptInApp;
    private Boolean notifyApptEmail;
    private Boolean notifyApptSms;
    private Boolean notifyPromoEmail;

    private String accentColor;
    private String dateFormat;
    private String timeFormat;
}
