package com.placementtracker.backend.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "resume_analysis")
public class ResumeAnalysis {
    @Id
    private String id;
    private String userId;
    private int atsScore;
    private List<String> missingKeywords;
    private List<Suggestion> suggestions;
    private List<ImprovedBullet> improvedBullets;
    private List<String> acknowledgedKeywords;
    private String rawText;
    private LocalDateTime analyzedAt;
    private StructuredResume structuredResume;
    
    @Data
    public static class ImprovedBullet {
        private String original;
        private String improved;
    }
    
    @Data
    public static class Suggestion {
        private String type;
        private String title;
        private String detail;
    }

    @Data
    public static class StructuredResume {
        private String name;
        private String contact;
        private List<Section> sections;
    }

    @Data
    public static class Section {
        private String heading;
        private List<Entry> entries;
    }

    @Data
    public static class Entry {
        private String title;
        private String subtitle;
        private String dateRange;
        private List<String> bullets;
    }
}
