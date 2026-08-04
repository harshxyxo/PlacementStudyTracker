package com.placementtracker.backend.controllers;

import com.placementtracker.backend.services.ActivityLogService;
import com.placementtracker.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/activity-logs")
public class ActivityLogController {

    @Autowired
    private ActivityLogService activityLogService;

    @PostMapping
    public ResponseEntity<?> createLog(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        String actionType = payload.get("actionType");
        String details = payload.get("details");
        
        if (actionType == null || details == null) {
            return ResponseEntity.badRequest().body("actionType and details are required");
        }

        activityLogService.logActivity(userDetails.getId(), actionType, details);
        
        return ResponseEntity.ok().build();
    }
}
