package com.example.InsurAI.controller;

import com.example.InsurAI.dto.PolicyPlanCreateUpdateRequest;
import com.example.InsurAI.dto.PolicyPlanDto;
import com.example.InsurAI.service.AdminPolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/admin/policies")
@RequiredArgsConstructor
public class AdminPolicyController {

    private final AdminPolicyService adminPolicyService;

    // =============== POLICY CRUD ===============

    @GetMapping("/plans")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PolicyPlanDto>> listAllPlans() {
        return ResponseEntity.ok(adminPolicyService.listAllPlans());
    }

    @PostMapping("/plans")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyPlanDto> createPlan(
            @RequestBody PolicyPlanCreateUpdateRequest request) {
        return ResponseEntity.ok(adminPolicyService.createPlan(request));
    }

    @PutMapping("/plans/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyPlanDto> updatePlan(
            @PathVariable Long id,
            @RequestBody PolicyPlanCreateUpdateRequest request) {
        return ResponseEntity.ok(adminPolicyService.updatePlan(id, request));
    }

    @DeleteMapping("/plans/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        adminPolicyService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/plans/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyPlanDto> updateStatus(
            @PathVariable Long id,
            @RequestParam boolean active) {
        return ResponseEntity.ok(adminPolicyService.updateStatus(id, active));
    }

    // =============== FILE UPLOAD/DOWNLOAD ===============

    /**
     * Upload file to a policy plan (multipart/form-data)
     * Admin only endpoint
     */
    @PostMapping("/plans/{id}/upload-file")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyPlanDto> uploadFileToPolicy(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        try {
            adminPolicyService.attachFileToPlan(id, file);
            // Return updated policy with file info
            List<PolicyPlanDto> plans = adminPolicyService.listAllPlans();
            PolicyPlanDto updated = plans.stream()
                    .filter(p -> p.getId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Policy not found"));
            return ResponseEntity.ok(updated);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Remove file from a policy plan
     * Admin only endpoint
     */
    @DeleteMapping("/plans/{id}/remove-file")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyPlanDto> removeFileFromPolicy(@PathVariable Long id) {
        adminPolicyService.removeFileFromPlan(id);
        // Return updated policy without file
        List<PolicyPlanDto> plans = adminPolicyService.listAllPlans();
        PolicyPlanDto updated = plans.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Policy not found"));
        return ResponseEntity.ok(updated);
    }

    /**
     * Download policy file (customers access)
     * Accessible to authenticated users (CUSTOMER, AGENT, ADMIN)
     */
    @GetMapping("/plans/{id}/download-file")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<byte[]> downloadPolicyFile(@PathVariable Long id) {
        try {
            byte[] fileContent = adminPolicyService.getFileForPolicy(id);

            // Get policy to retrieve file metadata
            List<PolicyPlanDto> plans = adminPolicyService.listAllPlans();
            PolicyPlanDto policy = plans.stream()
                    .filter(p -> p.getId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Policy not found"));

            // Build response headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(policy.getContentType()));
            headers.setContentDisposition(
                    ContentDisposition.attachment()
                            .filename(policy.getFileName(), StandardCharsets.UTF_8)
                            .build()
            );
            headers.setContentLength(fileContent.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileContent);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // =============== STATISTICS ===============

    @GetMapping("/stats/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<?>> getCategoryStats() {
        // Implementation for category stats
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/stats/usage")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<?>> getUsageStats() {
        // Implementation for usage stats
        return ResponseEntity.ok(List.of());
    }
}
