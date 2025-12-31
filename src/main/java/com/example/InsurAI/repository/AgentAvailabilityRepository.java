package com.example.InsurAI.repository;

import com.example.InsurAI.entity.AgentAvailability;
import com.example.InsurAI.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AgentAvailabilityRepository extends JpaRepository<AgentAvailability, Long> {

    List<AgentAvailability> findByAgentOrderByDateAscStartTimeAsc(User agent);

    List<AgentAvailability> findByDateAndStatusOrderByStartTimeAsc(LocalDate date, String status);
}
