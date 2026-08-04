package com.placementtracker.backend.services;

import com.placementtracker.backend.models.ActivityLog;
import com.placementtracker.backend.repositories.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class ActivityLogService {
    @Autowired
    private ActivityLogRepository repo;

    public void logActivity(String userId, String actionType, String details) {
        ActivityLog log = new ActivityLog();
        log.setUserId(userId);
        log.setActionType(actionType);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());
        repo.save(log);
    }
}
