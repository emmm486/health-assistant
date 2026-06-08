package com.health.controller;

import com.health.dto.HealthProfileDto;
import com.health.service.HealthProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class HealthProfileController {
    private final HealthProfileService healthProfileService;

    private Long getCurrentUserId(Authentication authentication) {
        // In a real app, extract userId from JWT token
        // For now, use a placeholder
        return 1L;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            HealthProfileDto profile = healthProfileService.getProfile(userId);
            if (profile == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdateProfile(
            Authentication authentication,
            @RequestBody HealthProfileDto request) {
        try {
            Long userId = getCurrentUserId(authentication);
            HealthProfileDto profile = healthProfileService.createOrUpdateProfile(userId, request);
            return ResponseEntity.ok(new MessageResponse("Profile saved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    static class MessageResponse {
        public String message;

        MessageResponse(String message) {
            this.message = message;
        }
    }

    static class ErrorResponse {
        public String error;

        ErrorResponse(String error) {
            this.error = error;
        }
    }
}
