package com.health.service;

import com.health.dto.HealthProfileDto;
import com.health.entity.HealthProfile;
import com.health.repository.HealthProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HealthProfileService {
    private final HealthProfileRepository healthProfileRepository;

    public HealthProfileDto getProfile(Long userId) {
        HealthProfile profile = healthProfileRepository.findByUserId(userId)
                .orElse(null);

        if (profile == null) {
            return null;
        }

        return convertToDto(profile);
    }

    public HealthProfileDto createOrUpdateProfile(Long userId, HealthProfileDto dto) {
        HealthProfile profile = healthProfileRepository.findByUserId(userId)
                .orElse(new HealthProfile());

        profile.setUserId(userId);
        profile.setAge(dto.getAge());
        profile.setGender(HealthProfile.Gender.valueOf(dto.getGender()));
        profile.setHeight(dto.getHeight());
        profile.setWeight(dto.getWeight());
        profile.setActivityLevel(HealthProfile.ActivityLevel.valueOf(dto.getActivityLevel()));
        profile.setDietaryPreference(dto.getDietaryPreference());
        profile.setHealthGoal(dto.getHealthGoal());

        profile = healthProfileRepository.save(profile);
        return convertToDto(profile);
    }

    private HealthProfileDto convertToDto(HealthProfile profile) {
        return new HealthProfileDto(
                profile.getId(),
                profile.getAge(),
                profile.getGender().name(),
                profile.getHeight(),
                profile.getWeight(),
                profile.getActivityLevel().name(),
                profile.getDietaryPreference(),
                profile.getHealthGoal()
        );
    }
}
