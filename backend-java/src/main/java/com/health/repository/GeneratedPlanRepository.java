package com.health.repository;

import com.health.entity.GeneratedPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeneratedPlanRepository extends JpaRepository<GeneratedPlan, Long> {
    @Query(value = "SELECT * FROM generated_plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 20", nativeQuery = true)
    List<GeneratedPlan> findByUserIdOrderByCreatedAtDesc(Long userId);
}
