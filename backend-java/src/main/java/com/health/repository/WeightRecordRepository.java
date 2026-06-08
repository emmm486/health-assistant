package com.health.repository;

import com.health.entity.WeightRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeightRecordRepository extends JpaRepository<WeightRecord, Long> {
    @Query(value = "SELECT * FROM weight_records WHERE user_id = ? ORDER BY record_date DESC", nativeQuery = true)
    List<WeightRecord> findByUserIdOrderByRecordDateDesc(Long userId);

    @Query(value = "SELECT * FROM weight_records WHERE user_id = ? ORDER BY record_date ASC", nativeQuery = true)
    List<WeightRecord> findByUserIdOrderByRecordDateAsc(Long userId);
}
