package com.health.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "generated_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeneratedPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type")
    private PlanType planType;

    @Column(name = "week_number")
    private Integer weekNumber;

    @Column(name = "diet_plan", columnDefinition = "LONGTEXT")
    private String dietPlan;

    @Column(name = "exercise_plan", columnDefinition = "LONGTEXT")
    private String exercisePlan;

    @Column(name = "weight_context", columnDefinition = "LONGTEXT")
    private String weightContext;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum PlanType {
        diet, exercise, combined
    }
}
