package com.health.controller;

import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        HealthResponse response = new HealthResponse("ok", LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @Data
    static class HealthResponse {
        private String status;
        private LocalDateTime timestamp;

        HealthResponse(String status, LocalDateTime timestamp) {
            this.status = status;
            this.timestamp = timestamp;
        }
    }
}
