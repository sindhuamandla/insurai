package com.example.InsurAI.service;

import com.example.InsurAI.dto.ProfileDto;
import com.example.InsurAI.dto.ProfileUpdateRequest;
import com.example.InsurAI.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.example.InsurAI.entity.Profile;
import com.example.InsurAI.repository.ProfileRepository;
import com.example.InsurAI.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

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

    public ProfileDto getProfileForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Profile profile = getOrCreateProfile(user);
        return toDto(user, profile);
    }

    public ProfileDto updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Profile profile = getOrCreateProfile(user);

        if (StringUtils.hasText(request.getName())) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }

        if (request.getLocation() != null) {
            profile.setLocation(request.getLocation().trim());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio().trim());
        }
        if (request.getExperienceYears() != null && request.getExperienceYears() >= 0) {
            profile.setExperienceYears(request.getExperienceYears());
        }
        if (request.getCompanyName() != null) {
            profile.setCompanyName(request.getCompanyName().trim());
        }
        if (request.getSpecialties() != null) {
            profile.setSpecialties(request.getSpecialties().trim());
        }

        userRepository.save(user);
        Profile savedProfile = profileRepository.save(profile);
        return toDto(user, savedProfile);
    }

    private ProfileDto toDto(User user, Profile profile) {
        return new ProfileDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getPhone(),
                profile.getLocation(),
                profile.getBio(),
                profile.getExperienceYears(),
                profile.getCompanyName(),
                profile.getSpecialties()
        );
    }
}
