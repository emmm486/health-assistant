package com.health.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeightRecordDto {
    private Long id;

    private BigDecimal weight;

    @JsonProperty("record_date")
    private LocalDate recordDate;

    private String notes;
}
