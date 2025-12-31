package com.example.InsurAI.service;

import com.example.InsurAI.dto.AgentAvailabilityRequest;
import com.example.InsurAI.dto.AgentAvailabilityResponse;
import com.example.InsurAI.entity.AgentAvailability;
import com.example.InsurAI.entity.User;
import com.example.InsurAI.entity.UserRole;
import com.example.InsurAI.repository.AgentAvailabilityRepository;
import com.example.InsurAI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgentAvailabilityService {

    private final AgentAvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public List<AgentAvailabilityResponse> getMyAvailabilities(Long agentId) {
        User agent = findAgent(agentId);
        return availabilityRepository
                .findByAgentOrderByDateAscStartTimeAsc(agent)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AgentAvailabilityResponse createAvailability(Long agentId, AgentAvailabilityRequest req) {
        User agent = findAgent(agentId);

        LocalDate date = LocalDate.parse(req.getDate());
        LocalTime start = LocalTime.parse(req.getStartTime());
        LocalTime end = LocalTime.parse(req.getEndTime());

        if (!end.isAfter(start)) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        AgentAvailability availability = new AgentAvailability();
        availability.setAgent(agent);
        availability.setDate(date);
        availability.setStartTime(start);
        availability.setEndTime(end);
        availability.setStatus(req.getStatus() != null ? req.getStatus() : "OPEN");
        availability.setNotes(req.getNotes());

        AgentAvailability saved = availabilityRepository.save(availability);

        notificationService.notifyUser(
                agentId,
                "SLOT_CREATED",
                "New availability slot",
                "Slot on " + date + " from " + start + " to " + end + " created."
        );

        return toResponse(saved);
    }

    public List<AgentAvailabilityResponse> getOpenSlotsForDate(LocalDate date) {
        return availabilityRepository
                .findByDateAndStatusOrderByStartTimeAsc(date, "OPEN")
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private User findAgent(Long agentId) {
        User user = userRepository.findById(agentId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (user.getRole() != UserRole.AGENT) {
            throw new IllegalStateException("User is not an agent");
        }
        return user;
    }

    private AgentAvailabilityResponse toResponse(AgentAvailability a) {
        return new AgentAvailabilityResponse(
                a.getId(),
                a.getDate().toString(),
                a.getStartTime().toString(),
                a.getEndTime().toString(),
                a.getStatus(),
                a.getNotes(),
                a.getAgent().getId(),
                a.getAgent().getName()   // make sure User has getName()
        );
    }
}
