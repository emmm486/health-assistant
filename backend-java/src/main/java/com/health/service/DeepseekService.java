package com.health.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.health.config.DeepseekConfig;
import com.health.dto.HealthProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DeepseekService {
    private final DeepseekConfig deepseekConfig;
    private final WebClient.Builder webClientBuilder;
    private final Gson gson = new Gson();

    public Map<String, Object> generatePlan(HealthProfileDto profile, String weightContext) {
        try {
            String systemPrompt = buildSystemPrompt(weightContext);
            String userPrompt = buildUserPrompt(profile);

            String response = callDeepseekAPI(systemPrompt, userPrompt);
            return parsePlanResponse(response);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate plan: " + e.getMessage());
        }
    }

    private String buildSystemPrompt(String weightContext) {
        String prompt = "你是一位专业的健康顾问和营养师。请根据用户信息生成个性化的健康方案。";
        if (weightContext != null && !weightContext.isEmpty()) {
            prompt += "\n用户的体重变化背景：" + weightContext;
        }
        return prompt;
    }

    private String buildUserPrompt(HealthProfileDto profile) {
        return String.format(
                "请为以下用户生成一份一周的个性化健康方案：\n" +
                "用户信息：\n" +
                "- 年龄: %d岁\n" +
                "- 性别: %s\n" +
                "- 身高: %.1fcm\n" +
                "- 体重: %.1fkg\n" +
                "- 活动水平: %s\n" +
                "- 饮食偏好: %s\n" +
                "- 健康目标: %s\n\n" +
                "请以以下JSON格式生成方案：\n" +
                "{\"dietPlan\": {\"monday\": \"...\", \"tuesday\": \"...\", ..., \"summary\": \"...\"},\n" +
                "\"exercisePlan\": {\"monday\": \"...\", \"tuesday\": \"...\", ..., \"summary\": \"...\"},\n" +
                "\"tips\": [\"建议1\", \"建议2\", ...]}\n" +
                "确保计划详细、实用、易于执行。",
                profile.getAge(),
                translateGender(profile.getGender()),
                profile.getHeight(),
                profile.getWeight(),
                translateActivityLevel(profile.getActivityLevel()),
                profile.getDietaryPreference(),
                profile.getHealthGoal()
        );
    }

    private String callDeepseekAPI(String systemPrompt, String userPrompt) {
        Map<String, Object> messageSystem = new HashMap<>();
        messageSystem.put("role", "system");
        messageSystem.put("content", systemPrompt);

        Map<String, Object> messageUser = new HashMap<>();
        messageUser.put("role", "user");
        messageUser.put("content", userPrompt);

        Map<String, Object> request = new HashMap<>();
        request.put("model", "deepseek-chat");
        request.put("messages", List.of(messageSystem, messageUser));
        request.put("temperature", 0.7);
        request.put("max_tokens", 2000);

        WebClient webClient = webClientBuilder
                .baseUrl(deepseekConfig.getApiUrl())
                .defaultHeader("Authorization", "Bearer " + deepseekConfig.getApiKey())
                .build();

        String response = webClient.post()
                .uri("/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(gson.toJson(request))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return response;
    }

    private Map<String, Object> parsePlanResponse(String response) {
        try {
            JsonObject jsonResponse = JsonParser.parseString(response).getAsJsonObject();
            String content = jsonResponse.getAsJsonArray("choices")
                    .get(0).getAsJsonObject()
                    .getAsJsonObject("message")
                    .get("content").getAsString();

            // 尝试从响应中提取JSON
            int startIdx = content.indexOf('{');
            int endIdx = content.lastIndexOf('}') + 1;

            if (startIdx >= 0 && endIdx > startIdx) {
                String jsonPart = content.substring(startIdx, endIdx);
                JsonObject planJson = JsonParser.parseString(jsonPart).getAsJsonObject();
                return gson.fromJson(planJson, Map.class);
            }

            // 如果无法解析，返回原始内容
            Map<String, Object> result = new HashMap<>();
            Map<String, Object> dietPlan = new HashMap<>();
            dietPlan.put("summary", content);
            result.put("dietPlan", dietPlan);
            result.put("exercisePlan", new HashMap<>());
            result.put("tips", List.of());
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse plan response: " + e.getMessage());
        }
    }

    private String translateGender(String gender) {
        return "male".equals(gender) ? "男" : "female".equals(gender) ? "女" : "其他";
    }

    private String translateActivityLevel(String level) {
        return switch (level) {
            case "low" -> "低（久坐）";
            case "moderate" -> "中等（每周3-4次运动）";
            case "high" -> "高（每周5+次运动）";
            default -> level;
        };
    }
}
