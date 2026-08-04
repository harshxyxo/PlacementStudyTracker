package com.placementtracker.backend.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "company_applications")
public class CompanyApplication {
    @Id
    private String id;
    private String userId;
    private String company;
    private String role;
    private String location;
    private String salary;
    private String appliedDate;
    private int matchScore;
    private String status; // 'Applied', 'OA/Interview', 'Offer', 'Rejected'
    private String statusColor;
    private java.util.List<String> prepTopics;
}
