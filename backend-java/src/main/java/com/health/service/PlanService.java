package com.health.service;

import com.health.dto.HealthProfileDto;
import com.health.dto.PlanGenerateResponse;
import com.health.entity.GeneratedPlan;
import com.health.repository.GeneratedPlanRepository;
import com.health.repository.WeightRecordRepository;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanService {
    private final GeneratedPlanRepository generatedPlanRepository;
    private final WeightRecordRepository weightRecordRepository;
    private final DeepseekService deepseekService;
    private final HealthProfileService healthProfileService;
    private final Gson gson = new Gson();

    public PlanGenerateResponse generatePlan(Long userId, HealthProfileDto profile) {
        // 获取体重背景信息
        String weightContext = buildWeightContext(userId);

        // 调用 DeepSeek API
        Map<String, Object> planData = deepseekService.generatePlan(profile, weightContext);

        // 获取当前周数
        int weekNumber = (LocalDate.now().getDayOfMonth() - 1) / 7 + 1;

        // 保存计划到数据库
        GeneratedPlan plan = new GeneratedPlan();
        plan.setUserId(userId);
        plan.setPlanType(GeneratedPlan.PlanType.combined);
        plan.setWeekNumber(weekNumber);
        plan.setDietPlan(gson.toJson(planData.get("dietPlan")));
        plan.setExercisePlan(gson.toJson(planData.get("exercisePlan")));
        plan.setWeightContext(weightContext != null ? weightContext : "");

        generatedPlanRepository.save(plan);

        return new PlanGenerateResponse(planData, weekNumber, "Plan generated successfully");
    }

    private String buildWeightContext(Long userId) {
        var records = weightRecordRepository.findByUserIdOrderByRecordDateDesc(userId);
        if (records.isEmpty()) {
            return null;
        }

        List<String> weightTrend = records.stream()
                .limit(5)
                .map(r -> r.getRecordDate() + ": " + r.getWeight() + "kg")
                .collect(Collectors.toList());

        var firstRecord = records.get(records.size() - 1);
        var lastRecord = records.get(0);
        var change = lastRecord.getWeight().subtract(firstRecord.getWeight());

        return "最近体重记录: " + String.join(", ", weightTrend) +
                "。体重变化: " + (change.signum() > 0 ? "+" : "") + change + "kg";
    }

    public List<Map<String, Object>> getPlanHistory(Long userId) {
        List<GeneratedPlan> plans = generatedPlanRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return plans.stream()
                .map(plan -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", plan.getId());
                    map.put("week_number", plan.getWeekNumber());
                    map.put("created_at", plan.getCreatedAt());
                    map.put("dietPlan", gson.fromJson(plan.getDietPlan(), Map.class));
                    map.put("exercisePlan", gson.fromJson(plan.getExercisePlan(), Map.class));
                    map.put("weight_context", plan.getWeightContext());
                    return map;
                })
                .collect(Collectors.toList());
    }
}
