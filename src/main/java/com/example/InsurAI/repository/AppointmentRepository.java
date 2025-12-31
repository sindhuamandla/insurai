package com.example.InsurAI.repository;

import com.example.InsurAI.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByCustomerIdOrderByScheduledAtDesc(Long customerId);

    List<Appointment> findByAgentIdOrderByScheduledAtDesc(Long agentId);

    long countByScheduledAtBetween(LocalDateTime start, LocalDateTime end);

    List<Appointment> findTop10ByOrderByCreatedAtDesc();

    @Query("select count(a) from Appointment a where date(a.createdAt) = :date")
    long countByCreatedAtDate(@Param("date") LocalDate date);
}
