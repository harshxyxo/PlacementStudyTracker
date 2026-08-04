package com.placementtracker.backend.repositories;

import com.placementtracker.backend.models.ActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {
    List<ActivityLog> findByUserIdOrderByTimestampDesc(String userId);
}
