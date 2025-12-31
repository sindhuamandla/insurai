package com.example.InsurAI.service;

import com.example.InsurAI.dto.UserSettingsDto;
import com.example.InsurAI.dto.UserSettingsUpdateRequest;
import com.example.InsurAI.entity.User;
import com.example.InsurAI.entity.Profile;
import com.example.InsurAI.repository.UserRepository;
import com.example.InsurAI.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserSettingsService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    private Profile getOrCreateProfile(User user) {
        return profileRepository.findByUser(user).orElseGet(() -> {
            Profile p = new Profile();
            p.setUser(user);
            p.setAccentColor("teal");
            p.setDateFormat("DD-MM-YYYY");
            p.setTimeFormat("24h");
            return profileRepository.save(p);
        });
    }

    public UserSettingsDto getSettingsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Profile profile = getOrCreateProfile(user);
        return toDto(profile);
    }

    public UserSettingsDto updateSettings(Long userId, UserSettingsUpdateRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Profile profile = getOrCreateProfile(user);

        if (req.getNotifyApptInApp() != null) {
            profile.setNotifyApptInApp(req.getNotifyApptInApp());
        }
        if (req.getNotifyApptEmail() != null) {
            profile.setNotifyApptEmail(req.getNotifyApptEmail());
        }
        if (req.getNotifyApptSms() != null) {
            profile.setNotifyApptSms(req.getNotifyApptSms());
        }
        if (req.getNotifyPromoEmail() != null) {
            profile.setNotifyPromoEmail(req.getNotifyPromoEmail());
        }

        if (StringUtils.hasText(req.getAccentColor())) {
            String v = req.getAccentColor().trim().toLowerCase();
            if (v.equals("teal") || v.equals("blue") || v.equals("purple") || v.equals("green")) {
                profile.setAccentColor(v);
            }
        }

        if (StringUtils.hasText(req.getDateFormat())) {
            String f = req.getDateFormat().trim();
            if (f.equals("DD-MM-YYYY") || f.equals("MM-DD-YYYY") || f.equals("YYYY-MM-DD")) {
                profile.setDateFormat(f);
            }
        }

        if (StringUtils.hasText(req.getTimeFormat())) {
            String f = req.getTimeFormat().trim();
            if (f.equals("24h") || f.equals("12h")) {
                profile.setTimeFormat(f);
            }
        }

        Profile saved = profileRepository.save(profile);
        return toDto(saved);
    }

    private UserSettingsDto toDto(Profile profile) {
        return new UserSettingsDto(
                profile.getNotifyApptInApp(),
                profile.getNotifyApptEmail(),
                profile.getNotifyApptSms(),
                profile.getNotifyPromoEmail(),
                profile.getAccentColor(),
                profile.getDateFormat(),
                profile.getTimeFormat()
        );
    }
}

