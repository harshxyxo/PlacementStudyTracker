package com.placementtracker.backend.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "mock_interviews")
public class MockInterview {
    @Id
    private String id;
    private String userId;
    private String interviewerName;
    private String interviewerRole;
    private String topic;
    private LocalDateTime scheduledAt;
    private String status; // 'Upcoming', 'Completed'
    
    // Feedback fields
    private Double feedbackScore;
    private String feedbackText;
    private List<String> feedbackTags;
}
