package com.example.InsurAI.service;

import com.example.InsurAI.dto.AppointmentResponse;
import com.example.InsurAI.dto.AppointmentScheduleRequest;
import com.example.InsurAI.entity.AgentAvailability;
import com.example.InsurAI.entity.Appointment;
import com.example.InsurAI.entity.User;
import com.example.InsurAI.entity.UserRole;
import com.example.InsurAI.repository.AgentAvailabilityRepository;
import com.example.InsurAI.repository.AppointmentRepository;
import com.example.InsurAI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final AgentAvailabilityRepository availabilityRepository;
    private final NotificationService notificationService;

    @Transactional
    public AppointmentResponse scheduleAppointment(Long customerId, AppointmentScheduleRequest req) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        User agent = userRepository.findById(req.getAgentId())
                .orElseThrow(() -> new IllegalArgumentException("Agent not found"));

        AgentAvailability availability = availabilityRepository
                .findById(req.getAvailabilityId())
                .orElseThrow(() -> new IllegalArgumentException("Availability slot not found"));

        if (!"OPEN".equalsIgnoreCase(availability.getStatus())) {
            throw new IllegalStateException("Availability slot is not open");
        }

        LocalDateTime scheduledAt;
        if (req.getScheduledAt() != null && !req.getScheduledAt().isBlank()) {
            scheduledAt = LocalDateTime.parse(req.getScheduledAt());
        } else {
            LocalDate date = availability.getDate();
            LocalTime start = availability.getStartTime();
            scheduledAt = LocalDateTime.of(date, start);
        }

        Appointment appt = new Appointment();
        appt.setCustomer(customer);
        appt.setAgent(agent);
        appt.setAvailability(availability);
        appt.setScheduledAt(scheduledAt);
        appt.setStatus("BOOKED");
        appt.setReason(req.getReason());
        appt.setNotes(req.getNotes());

        Appointment saved = appointmentRepository.save(appt);

        // Mark availability as booked
        availability.setStatus("BOOKED");
        availabilityRepository.save(availability);

        // Send notifications
        notificationService.notifyUser(
                customer.getId(),
                "APPOINTMENT",
                "Appointment scheduled",
                "Your appointment with agent " + agent.getName() + " is confirmed for " + scheduledAt
        );

        notificationService.notifyUser(
                agent.getId(),
                "APPOINTMENT",
                "New appointment",
                "New appointment with customer " + customer.getName() + " scheduled for " + scheduledAt
        );

        return toResponse(saved);
    }

    public List<AppointmentResponse> getAppointmentsForCustomer(Long customerId) {
        return appointmentRepository
                .findByCustomerIdOrderByScheduledAtDesc(customerId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAppointmentsForAgent(Long agentId) {
        return appointmentRepository
                .findByAgentIdOrderByScheduledAtDesc(agentId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private AppointmentResponse toResponse(Appointment a) {
        AppointmentResponse resp = new AppointmentResponse(
                a.getId(),
                a.getCustomer().getId(),
                a.getAgent().getId(),
                a.getAvailability() != null ? a.getAvailability().getId() : null,
                a.getScheduledAt().toString(),
                a.getStatus(),
                a.getReason(),
                a.getNotes()
        );
        // set names
        resp.setCustomerName(a.getCustomer().getName());
        resp.setAgentName(a.getAgent().getName());
        return resp;
    }

    @Transactional
    public AppointmentResponse updateAppointmentStatus(Long agentId, Long appointmentId, String newStatus) {
        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        if (!appointment.getAgent().getId().equals(agentId)) {
            throw new IllegalStateException("You can only update your own appointments");
        }

        appointment.setStatus(newStatus);
        Appointment updated = appointmentRepository.save(appointment);

        // Notify customer about status change
        notificationService.notifyUser(
                appointment.getCustomer().getId(),
                "APPOINTMENT_STATUS_CHANGED",
                "Appointment status updated",
                "Your appointment with agent " + appointment.getAgent().getName() +
                        " status is now " + newStatus.toLowerCase()
        );

        // Notify agent
        notificationService.notifyUser(
                appointment.getAgent().getId(),
                "APPOINTMENT_STATUS_CHANGED",
                "Appointment updated",
                "Your appointment with customer " + appointment.getCustomer().getName() +
                        " status changed to " + newStatus.toLowerCase()
        );

        return toResponse(updated);
    }

    public List<AppointmentResponse> getRecentAppointmentsForAdmin() {
        return appointmentRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(a -> new AppointmentResponse(
                        a.getId(),
                        a.getCustomer().getId(),
                        a.getAgent() != null ? a.getAgent().getId() : null,
                        a.getAvailability() != null ? a.getAvailability().getId() : null,
                        a.getScheduledAt() != null ? a.getScheduledAt().toString() : null,
                        a.getStatus(),
                        a.getReason(),
                        a.getNotes(),
                        a.getCustomer().getEmail(),
                        a.getAgent() != null ? a.getAgent().getEmail() : ""
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAllAppointmentsForAdmin() {
        return appointmentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
