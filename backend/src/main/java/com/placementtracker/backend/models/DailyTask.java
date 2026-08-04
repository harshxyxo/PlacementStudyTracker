package com.placementtracker.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDate;

@Data
@Document(collection = "daily_tasks")
public class DailyTask {
    @Id
    private String id;
    private String userId;
    private String title;
    private String description;
    private boolean completed;
    private LocalDate date;
}
