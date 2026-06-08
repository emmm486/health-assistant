package com.health.controller;

import com.health.dto.WeightRecordDto;
import com.health.dto.WeightStatsDto;
import com.health.service.WeightRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/weight")
@RequiredArgsConstructor
public class WeightRecordController {
    private final WeightRecordService weightRecordService;

    private Long getCurrentUserId(Authentication authentication) {
        return 1L; // Placeholder
    }

    @PostMapping
    public ResponseEntity<?> recordWeight(
            Authentication authentication,
            @RequestBody WeightRecordRequest request) {
        try {
            Long userId = getCurrentUserId(authentication);
            weightRecordService.recordWeight(userId, request.weight, request.notes);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new MessageResponse("Weight recorded successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getWeightHistory(Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            List<WeightRecordDto> history = weightRecordService.getWeightHistory(userId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getWeightStats(Authentication authentication) {
        try {
            Long userId = getCurrentUserId(authentication);
            WeightStatsDto stats = weightRecordService.getWeightStats(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    static class WeightRecordRequest {
        public BigDecimal weight;
        public String notes;
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
