package com.placementtracker.backend.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "problems")
public class Problem {

    @Id
    private String id;
    
    private String title;
    
    private String difficulty; // Easy, Medium, Hard
    
    private String category;
    
    private String leetcodeLink;
}
