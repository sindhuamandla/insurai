package com.example.InsurAI.service;

import com.example.InsurAI.dto.SupportTicketCreateRequest;
import com.example.InsurAI.dto.SupportTicketReplyRequest;
import com.example.InsurAI.dto.SupportTicketResponse;
import com.example.InsurAI.entity.SupportTicket;
import com.example.InsurAI.entity.User;
import com.example.InsurAI.repository.SupportTicketRepository;
import com.example.InsurAI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupportService {

    private final SupportTicketRepository supportTicketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;

    @Transactional
    public SupportTicketResponse createTicket(Long userId,
                                              SupportTicketCreateRequest req,
                                              MultipartFile attachment) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        SupportTicket ticket = new SupportTicket();
        ticket.setUser(user);
        ticket.setSubject(req.getSubject());
        ticket.setCategory(req.getCategory());
        ticket.setContactName(req.getName());
        ticket.setContactEmail(req.getEmail());
        ticket.setContactPhone(req.getPhone());
        ticket.setMessage(req.getMessage());
        ticket.setStatus("OPEN");

        if (attachment != null && !attachment.isEmpty()) {
            String storedPath = storeAttachment(attachment);
            ticket.setAttachmentPath(storedPath);
        }

        SupportTicket saved = supportTicketRepository.save(ticket);

        // notify admins
        String notifTitle = "New support request: " + saved.getSubject();
        String notifMsg = "Category: " + saved.getCategory() + " • From: " + user.getEmail();
        notificationService.notifyAdminsAboutSupportTicket(
                "SUPPORT_TICKET_CREATED",
                notifTitle,
                notifMsg
        );

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<SupportTicketResponse> getMyTickets(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return supportTicketRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SupportTicketResponse> getAllTickets() {
        return supportTicketRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SupportTicketResponse replyToTicket(Long ticketId,
                                               SupportTicketReplyRequest req,
                                               Long adminUserId) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));

        ticket.setLastAdminResponse(req.getReplyMessage());
        if (req.getNewStatus() != null && !req.getNewStatus().isBlank()) {
            ticket.setStatus(req.getNewStatus());
        }

        SupportTicket saved = supportTicketRepository.save(ticket);

        // notify original user
        notificationService.notifyUserAboutSupportReply(
                ticket.getUser().getId(),
                ticket.getSubject(),
                req.getReplyMessage()
        );

        return toResponse(saved);
    }

    private SupportTicketResponse toResponse(SupportTicket t) {
        return new SupportTicketResponse(
                t.getId(),
                t.getSubject(),
                t.getCategory(),
                t.getStatus(),
                t.getMessage(),
                t.getLastAdminResponse(),
                t.getContactName(),
                t.getContactEmail(),
                t.getContactPhone(),
                t.getCreatedAt() != null ? formatter.format(t.getCreatedAt()) : null
        );
    }

    // Very simple local storage; adapt path as needed
    private String storeAttachment(MultipartFile file) {
        try {
            String uploadsDir = "uploads/support";
            Files.createDirectories(Path.of(uploadsDir));
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path target = Path.of(uploadsDir, filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return target.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store attachment", e);
        }
    }
}
