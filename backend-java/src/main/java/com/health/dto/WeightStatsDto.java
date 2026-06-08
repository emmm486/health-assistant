package com.health.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeightStatsDto {
    private BigDecimal current;
    private BigDecimal initial;
    private BigDecimal change;
    private Integer recordCount;
    private List<WeightRecordDto> records;
}
