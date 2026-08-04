package com.placementtracker.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryStatsDTO {
    private String category;
    private long totalProblems;
    private long solvedProblems;
}
