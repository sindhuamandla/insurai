package com.example.InsurAI.service;

import com.example.InsurAI.dto.PolicyPlanCreateUpdateRequest;
import com.example.InsurAI.dto.PolicyPlanDto;
import com.example.InsurAI.entity.PolicyPlan;
import com.example.InsurAI.repository.PolicyPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminPolicyService {

    private final PolicyPlanRepository policyPlanRepository;

    // =============== FILE UPLOAD HANDLING ===============
    public void attachFileToPlan(Long policyId, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        // File size validation (max 10MB)
        long maxFileSize = 10 * 1024 * 1024;
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }

        // Allowed extensions
        String[] allowedExtensions = {".pdf", ".doc", ".docx", ".txt", ".xls", ".xlsx"};
        String fileName = file.getOriginalFilename().toLowerCase();
        boolean isAllowed = false;
        for (String ext : allowedExtensions) {
            if (fileName.endsWith(ext)) {
                isAllowed = true;
                break;
            }
        }
        if (!isAllowed) {
            throw new IllegalArgumentException("File type not allowed. Use: PDF, DOC, DOCX, TXT, XLS, XLSX");
        }

        PolicyPlan plan = policyPlanRepository.findById(policyId)
                .orElseThrow(() -> new IllegalArgumentException("Policy plan not found"));

        // Store file in database
        plan.setFileContent(file.getBytes());
        plan.setFileName(sanitizeFileName(file.getOriginalFilename()));
        plan.setFileContentType(file.getContentType());
        plan.setFileOriginalName(file.getOriginalFilename());
        plan.setFileUploadedAt(LocalDateTime.now());

        policyPlanRepository.save(plan);
    }

    // Remove file from policy
    @Transactional
    public void removeFileFromPlan(Long policyId) {
        PolicyPlan plan = policyPlanRepository.findById(policyId)
                .orElseThrow(() -> new IllegalArgumentException("Policy plan not found"));

        plan.setFileContent(null);
        plan.setFileName(null);
        plan.setFileContentType(null);
        plan.setFileOriginalName(null);
        plan.setFileUploadedAt(null);

        policyPlanRepository.save(plan);
    }

    // Get file for download (customers)
    public byte[] getFileForPolicy(Long policyId) {
        PolicyPlan plan = policyPlanRepository.findById(policyId)
                .orElseThrow(() -> new IllegalArgumentException("Policy plan not found"));

        if (plan.getFileContent() == null || plan.getFileContent().length == 0) {
            throw new IllegalArgumentException("No file attached to this policy");
        }

        return plan.getFileContent();
    }

    // Helper: Sanitize file name to prevent path traversal attacks
    private String sanitizeFileName(String fileName) {
        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    // ====================================================

    @Transactional(readOnly = true)
    public List<PolicyPlanDto> listAllPlans() {
        return policyPlanRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PolicyPlanDto createPlan(PolicyPlanCreateUpdateRequest req) {
        PolicyPlan plan = new PolicyPlan();
        applyPlan(plan, req);
        PolicyPlan saved = policyPlanRepository.save(plan);
        return toDto(saved);
    }

    @Transactional
    public PolicyPlanDto updatePlan(Long id, PolicyPlanCreateUpdateRequest req) {
        PolicyPlan plan = policyPlanRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Policy plan not found: " + id));
        applyPlan(plan, req);
        PolicyPlan saved = policyPlanRepository.save(plan);
        return toDto(saved);
    }

    @Transactional
    public PolicyPlanDto updateStatus(Long id, boolean active) {
        PolicyPlan plan = policyPlanRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Policy plan not found"));
        plan.setActive(active);
        PolicyPlan saved = policyPlanRepository.save(plan);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<PolicyPlanDto> listActive() {
        return policyPlanRepository.findByActiveTrue()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public void deletePlan(Long id) {
        if (!policyPlanRepository.existsById(id)) {
            throw new IllegalArgumentException("Plan not found");
        }
        policyPlanRepository.deleteById(id);
    }

    private void applyPlan(PolicyPlan plan, PolicyPlanCreateUpdateRequest req) {
        plan.setName(req.getName());
        plan.setCategory(req.getCategory());
        plan.setPremiumAmount(req.getPremiumAmount());
        plan.setCoverageAmount(req.getCoverageAmount());
        plan.setActive(req.isActive());
        plan.setDescription(req.getDescription());
    }

    private PolicyPlanDto toDto(PolicyPlan plan) {
        long fileSizeBytes = plan.getFileContent() != null ? plan.getFileContent().length : 0;
        return new PolicyPlanDto(
                plan.getId(),
                plan.getName(),
                plan.getCategory(),
                plan.getPremiumAmount(),
                plan.getCoverageAmount(),
                plan.isActive(),
                plan.getDescription(),
                plan.getFileName(),        // File name for display
                plan.getFileContentType(), // MIME type
                plan.getFileUploadedAt(),  // Upload timestamp
                fileSizeBytes              // File size
        );
    }
}
