package com.placementtracker.backend.dto;

import com.placementtracker.backend.models.MockInterview;
import lombok.Data;
import java.util.List;

@Data
public class DashboardStats {
    private int dsaSolvedCount;
    private int dsaTotalCount;
    private int atsScore;
    private int weeklyReadiness;
    private List<MockInterview> upcomingInterviews;
}
