package com.placementtracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResult {
    private String id;
    private String type; // "PROBLEM" or "COMPANY"
    private String title;
    private String subtitle;
    private String url;
}
