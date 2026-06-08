package com.health.service;

import com.health.dto.WeightRecordDto;
import com.health.dto.WeightStatsDto;
import com.health.entity.WeightRecord;
import com.health.repository.WeightRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WeightRecordService {
    private final WeightRecordRepository weightRecordRepository;

    public void recordWeight(Long userId, BigDecimal weight, String notes) {
        WeightRecord record = new WeightRecord();
        record.setUserId(userId);
        record.setWeight(weight);
        record.setRecordDate(LocalDate.now());
        record.setNotes(notes);

        weightRecordRepository.save(record);
    }

    public List<WeightRecordDto> getWeightHistory(Long userId) {
        List<WeightRecord> records = weightRecordRepository.findByUserIdOrderByRecordDateDesc(userId);
        return records.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public WeightStatsDto getWeightStats(Long userId) {
        List<WeightRecord> records = weightRecordRepository.findByUserIdOrderByRecordDateAsc(userId);

        if (records.isEmpty()) {
            return new WeightStatsDto(null, null, BigDecimal.ZERO, 0, List.of());
        }

        BigDecimal initial = records.get(0).getWeight();
        BigDecimal current = records.get(records.size() - 1).getWeight();
        BigDecimal change = current.subtract(initial);

        List<WeightRecordDto> dtos = records.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return new WeightStatsDto(current, initial, change, records.size(), dtos);
    }

    private WeightRecordDto convertToDto(WeightRecord record) {
        return new WeightRecordDto(
                record.getId(),
                record.getWeight(),
                record.getRecordDate(),
                record.getNotes()
        );
    }
}
