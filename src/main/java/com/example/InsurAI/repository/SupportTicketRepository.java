package com.example.InsurAI.repository;

import com.example.InsurAI.entity.SupportTicket;
import com.example.InsurAI.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {

    List<SupportTicket> findByUserOrderByCreatedAtDesc(User user);

    List<SupportTicket> findByStatusOrderByCreatedAtAsc(String status);
}
