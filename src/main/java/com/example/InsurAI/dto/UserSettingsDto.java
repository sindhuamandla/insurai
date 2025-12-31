package com.example.InsurAI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettingsDto {
    private Boolean notifyApptInApp;
    private Boolean notifyApptEmail;
    private Boolean notifyApptSms;
    private Boolean notifyPromoEmail;

    private String accentColor;
    private String dateFormat;
    private String timeFormat;
}
