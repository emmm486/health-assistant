package com.health.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthProfileDto {
    private Long id;

    @NotNull
    private Integer age;

    @NotNull
    private String gender;

    @NotNull
    private BigDecimal height;

    @NotNull
    private BigDecimal weight;

    @NotNull
    private String activityLevel;

    private String dietaryPreference;

    private String healthGoal;
}
