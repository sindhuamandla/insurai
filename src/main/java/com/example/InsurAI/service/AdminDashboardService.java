package com.example.InsurAI.service;

import com.example.InsurAI.dto.AdminDashboardSummary;
import com.example.InsurAI.dto.DailyUserStatDto;
import com.example.InsurAI.entity.UserRole;
import com.example.InsurAI.repository.AppointmentRepository;
import com.example.InsurAI.repository.PolicyPlanRepository;
import com.example.InsurAI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final PolicyPlanRepository policyPlanRepository;

    public AdminDashboardSummary getSummary() {
        ZoneId zone = ZoneId.systemDefault();
        LocalDate today = LocalDate.now(zone);
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime startOf7DaysAgo = today.minusDays(6).atStartOfDay();

        long totalAppointmentsToday =
                appointmentRepository.countByScheduledAtBetween(
                        startOfToday,
                        startOfToday.plusDays(1)
                );

        long totalAppointmentsLast7Days =
                appointmentRepository.countByScheduledAtBetween(
                        startOf7DaysAgo,
                        startOfToday.plusDays(1)
                );

        long totalAppointmentsAllTime =
                appointmentRepository.count();

        long totalActiveCustomers =
                userRepository.countByRoleAndEnabled(UserRole.CUSTOMER, true);

        long totalActiveAgents =
                userRepository.countByRoleAndEnabled(UserRole.AGENT, true);

        long totalActivePlans =
                policyPlanRepository.countByActiveTrue();

        return new AdminDashboardSummary(
                totalAppointmentsToday,
                totalAppointmentsLast7Days,
                totalAppointmentsAllTime,
                totalActiveCustomers,
                totalActiveAgents,
                totalActivePlans
        );
    }

    // Appointments per day (used by /stats/appointments/daily and dashboard charts)
    public List<DailyUserStatDto> getDailyAppointmentStats(int days) {
        if (days <= 0) {
            days = 14;
        }

        List<DailyUserStatDto> result = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            long count = appointmentRepository.countByCreatedAtDate(date);
            // reuse DailyUserStatDto: first value = newAppointments, second = same
            result.add(new DailyUserStatDto(date.toString(), count, count));
        }

        return result;
    }

    // Plans created per day (if needed on dashboard)
    public List<DailyUserStatDto> getDailyPlanStats(int days) {
        if (days <= 0) {
            days = 14;
        }

        List<DailyUserStatDto> result = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            long count = policyPlanRepository.countByCreatedAtDate(date);
            result.add(new DailyUserStatDto(date.toString(), count, count));
        }

        return result;
    }
}
