package com.example.InsurAI.service;

import com.example.InsurAI.dto.AdminUserDto;
import com.example.InsurAI.dto.UpdateUserRoleRequest;
import com.example.InsurAI.dto.UpdateUserStatusRequest;
import com.example.InsurAI.dto.DailyUserStatDto;
import com.example.InsurAI.entity.User;
import com.example.InsurAI.entity.UserRole;
import com.example.InsurAI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<AdminUserDto> listAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminUserDto updateUserRole(Long userId, UpdateUserRoleRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        UserRole newRole = req.getRole();
        if (newRole == null) {
            throw new IllegalArgumentException("Role must not be null");
        }

        user.setRole(newRole);
        User saved = userRepository.save(user);
        return toDto(saved);
    }

    @Transactional
    public AdminUserDto updateUserStatus(Long userId, UpdateUserStatusRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        user.setEnabled(req.isEnabled());
        User saved = userRepository.save(user);
        return toDto(saved);
    }

    private AdminUserDto toDto(User user) {
        String displayName = user.getName() != null && !user.getName().isBlank()
                ? user.getName()
                : user.getEmail();

        return new AdminUserDto(
                user.getId(),
                displayName,                          // name
                user.getEmail(),                     // email
                user.getRole().name(),               // role as String
                user.isEnabled(),
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
        );
    }

    // Used by dashboard & charts – new customers and active agents per day
    @Transactional(readOnly = true)
    public List<DailyUserStatDto> getDailyUserStats(int days) {
        if (days <= 0) {
            days = 14;
        }

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days - 1);

        List<DailyUserStatDto> result = new ArrayList<>();
        List<User> allUsers = userRepository.findAll();
        ZoneId zone = ZoneId.systemDefault();

        for (int i = 0; i < days; i++) {
            LocalDate date = startDate.plusDays(i);

            long newCustomers = allUsers.stream()
                    .filter(u -> u.getRole() == UserRole.CUSTOMER)
                    .filter(u -> u.getCreatedAt() != null)
                    .filter(u -> {
                        ZonedDateTime zdt = u.getCreatedAt().atZone(zone);
                        LocalDate createdDate = zdt.toLocalDate();
                        return createdDate.isEqual(date);
                    })
                    .count();

            long activeAgents = allUsers.stream()
                    .filter(u -> u.getRole() == UserRole.AGENT)
                    .filter(User::isEnabled)
                    .count();

            result.add(new DailyUserStatDto(
                    date.toString(),
                    newCustomers,
                    activeAgents
            ));
        }

        return result;
    }

    // Latest 10 users for dashboard side table
    @Transactional(readOnly = true)
    public List<AdminUserDto> getLatestUsers() {
        return userRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // List only agents (used by any agent-specific views)
    @Transactional(readOnly = true)
    public List<AdminUserDto> listAgents() {
        return userRepository.findByRole(UserRole.AGENT)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // Create agent credentials from admin
    @Transactional
    public AdminUserDto createAgentUser(String email, String rawPassword, String roleString) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (rawPassword == null || rawPassword.isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        UserRole role = UserRole.AGENT;
        try {
            if (roleString != null) {
                role = UserRole.valueOf(roleString.toUpperCase());
            }
        } catch (IllegalArgumentException ignored) {
            role = UserRole.AGENT;
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        user.setEnabled(true);

        String defaultName = email.contains("@")
                ? email.substring(0, email.indexOf("@"))
                : email;
        user.setName(defaultName);

        User saved = userRepository.save(user);
        return toDto(saved);
    }
}
