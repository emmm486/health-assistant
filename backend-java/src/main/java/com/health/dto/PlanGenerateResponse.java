package com.health.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlanGenerateResponse {
    private Map<String, Object> plan;
    private Integer weekNumber;
    private String message;
}
