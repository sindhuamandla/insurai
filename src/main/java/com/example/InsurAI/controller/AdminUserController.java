package com.example.InsurAI.controller;

import com.example.InsurAI.dto.*;
import com.example.InsurAI.service.AdminDashboardService;
import com.example.InsurAI.service.AdminUserService;
import com.example.InsurAI.service.AppointmentService;
import com.example.InsurAI.dto.CreateAgentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;
    private final AdminDashboardService adminDashboardService;
    private final AppointmentService appointmentService;

    // ===================== USERS LIST & MANAGEMENT =====================


    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminUserDto>> listAllUsers() {
        return ResponseEntity.ok(adminUserService.listAllUsers());
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserDto> updateRole(
            @PathVariable Long id,
            @RequestBody UpdateUserRoleRequest req
    ) {
        return ResponseEntity.ok(adminUserService.updateUserRole(id, req));
    }

    @PutMapping("/users/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserDto> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateUserStatusRequest req
    ) {
        return ResponseEntity.ok(adminUserService.updateUserStatus(id, req));
    }

    // -------- New: create agent credentials from admin --------
    @PostMapping("/users/create-agent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserDto> createAgent(
            @RequestBody CreateAgentRequest request
    ) {
        AdminUserDto created = adminUserService.createAgentUser(
                request.getEmail(),
                request.getPassword(),
                "AGENT"
        );
        return ResponseEntity.ok(created);
    }

    // ===================== DASHBOARD SUMMARY =====================


    @GetMapping("/dashboard/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminDashboardSummary getDashboardSummary() {
        return adminDashboardService.getSummary();
    }

    // ===================== DAILY STATS =====================

    @GetMapping("/stats/users/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DailyUserStatDto>> dailyUserStats(
            @RequestParam(name = "days", required = false, defaultValue = "14") int days
    ) {
        return ResponseEntity.ok(adminUserService.getDailyUserStats(days));
    }

    @GetMapping("/stats/appointments/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DailyUserStatDto>> dailyAppointmentStats(
            @RequestParam(name = "days", required = false, defaultValue = "14") int days
    ) {
        return ResponseEntity.ok(adminDashboardService.getDailyAppointmentStats(days));
    }

    @GetMapping("/stats/plans/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DailyUserStatDto>> dailyPlanStats(
            @RequestParam(name = "days", required = false, defaultValue = "14") int days
    ) {
        return ResponseEntity.ok(adminDashboardService.getDailyPlanStats(days));
    }

    // ---- Wrapper endpoints matching AdminDashboardPage.js URLs ----


    @GetMapping("/users/stats/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DailyUserStatDto>> dailyUserStatsForDashboard(
            @RequestParam(name = "days", required = false, defaultValue = "14") int days
    ) {
        return ResponseEntity.ok(adminUserService.getDailyUserStats(days));
    }


    @GetMapping("/users/appointments/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DailyUserStatDto>> dailyAppointmentStatsForDashboard(
            @RequestParam(name = "days", required = false, defaultValue = "14") int days
    ) {
        return ResponseEntity.ok(adminDashboardService.getDailyAppointmentStats(days));
    }

    // ===================== RECENT ITEMS FOR DASHBOARD =====================


    @GetMapping("/users/appointments/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AppointmentResponse> getRecentAppointmentsAdmin() {
        return appointmentService.getRecentAppointmentsForAdmin();
    }


    @GetMapping("/users/latest")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdminUserDto> getLatestUsers() {
        return adminUserService.getLatestUsers();
    }


    @GetMapping("/users/agents")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdminUserDto> listAgents() {
        return adminUserService.listAgents();
    }
}
