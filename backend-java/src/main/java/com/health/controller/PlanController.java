package com.health.controller;

import com.health.dto.HealthProfileDto;
import com.health.dto.PlanGenerateResponse;
import com.health.service.HealthProfileService;
import com.health.service.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/plan")
@RequiredArgsConstructor
public class PlanController {
    private final PlanService planService;
    private final HealthProfileService healthProfileService;

    private Long getCurrentUserId(Authentication authentication) {
        return 1L; // Placeholder
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generatePlan(Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            HealthProfileDto profile = healthProfileService.getProfile(userId);

            if (profile == null) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Health profile not found. Please complete your profile first."));
            }

            PlanGenerateResponse response = planService.generatePlan(userId, profile);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Failed to generate plan: " + e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getPlanHistory(Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            List<Map<String, Object>> history = planService.getPlanHistory(userId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    static class ErrorResponse {
        public String error;

        ErrorResponse(String error) {
            this.error = error;
        }
    }
}
