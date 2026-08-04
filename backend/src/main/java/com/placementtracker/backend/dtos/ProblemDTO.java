package com.placementtracker.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemDTO {
    private String id;
    private String title;
    private String difficulty;
    private String category;
    private String leetcodeLink;
    private String status; // Derived from UserProblemProgress (Unsolved, Solved, Needs Review)
}
