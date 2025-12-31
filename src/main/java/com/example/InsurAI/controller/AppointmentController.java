package com.example.InsurAI.controller;

import com.example.InsurAI.dto.AppointmentResponse;
import com.example.InsurAI.dto.AppointmentScheduleRequest;
import com.example.InsurAI.dto.UpdateAppointmentStatusRequest;
import com.example.InsurAI.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/schedule")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<AppointmentResponse> schedule(
            Authentication authentication,
            @RequestBody AppointmentScheduleRequest req
    ) {
        Long customerId = extractUserId(authentication);
        AppointmentResponse resp = appointmentService.scheduleAppointment(customerId, req);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/my/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<AppointmentResponse>> getMyCustomerAppointments(Authentication authentication) {
        Long customerId = extractUserId(authentication);
        List<AppointmentResponse> list = appointmentService.getAppointmentsForCustomer(customerId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/my/agent")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<List<AppointmentResponse>> getMyAgentAppointments(Authentication authentication) {
        Long agentId = extractUserId(authentication);
        List<AppointmentResponse> list = appointmentService.getAppointmentsForAgent(agentId);
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<AppointmentResponse> updateStatus(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody UpdateAppointmentStatusRequest req
    ) {
        Long agentId = extractUserId(authentication);
        AppointmentResponse resp = appointmentService.updateAppointmentStatus(agentId, id, req.getStatus());
        return ResponseEntity.ok(resp);
    }


    private Long extractUserId(Authentication authentication) {
        if (authentication == null) throw new IllegalStateException("Unauthenticated");
        Object details = authentication.getDetails();
        if (details instanceof Long id) return id;
        throw new IllegalStateException("User id not present in authentication");
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AppointmentResponse> getAllAppointmentsForAdmin() {
        return appointmentService.getAllAppointmentsForAdmin();
    }
}
