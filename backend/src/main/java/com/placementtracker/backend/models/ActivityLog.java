package com.placementtracker.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "activity_logs")
public class ActivityLog {
    @Id
    private String id;
    private String userId;
    private String actionType; // e.g., "PROBLEM_SOLVED", "RESUME_ANALYZED", "MOCK_SCHEDULED"
    private String details;
    private LocalDateTime timestamp;
}
