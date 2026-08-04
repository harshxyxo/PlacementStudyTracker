package com.placementtracker.backend.controllers;

import com.placementtracker.backend.models.ActivityLog;
import com.placementtracker.backend.repositories.ActivityLogRepository;
import com.placementtracker.backend.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.placementtracker.backend.security.CustomUserDetails;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    
    @Autowired
    private ActivityLogRepository repo;

    @GetMapping("/heatmap")
    public Map<String, Integer> getHeatmapData(@AuthenticationPrincipal CustomUserDetails user) {
        List<ActivityLog> logs = repo.findByUserIdOrderByTimestampDesc(user.getId());
        Map<String, Integer> heatmap = new HashMap<>();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        for (ActivityLog log : logs) {
            String date = log.getTimestamp().format(dtf);
            heatmap.put(date, heatmap.getOrDefault(date, 0) + 1);
        }
        return heatmap;
    }
    
    @GetMapping("/activities")
    public List<ActivityLog> getRecentActivities(@AuthenticationPrincipal CustomUserDetails user) {
        return repo.findByUserIdOrderByTimestampDesc(user.getId());
    }
}
