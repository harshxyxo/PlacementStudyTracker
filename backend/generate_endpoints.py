import os

BASE_DIR = r"c:\Users\harsh_isu7tmt\OneDrive\Desktop\PlacementStudyTracker\backend\src\main\java\com\placementtracker\backend"

models = {
    "CompanyApplication.java": """package com.placementtracker.backend.models;
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
}
""",
    "MockInterview.java": """package com.placementtracker.backend.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

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
}
""",
    "ResumeAnalysis.java": """package com.placementtracker.backend.models;
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
    private int overallScore;
    private int impactScore;
    private int brevityScore;
    private int skillsMatchScore;
    private List<String> criticalIssues;
    private List<String> suggestions;
    private LocalDateTime analyzedAt;
}
"""
}

repos = {
    "CompanyApplicationRepository.java": """package com.placementtracker.backend.repositories;
import com.placementtracker.backend.models.CompanyApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CompanyApplicationRepository extends MongoRepository<CompanyApplication, String> {
    List<CompanyApplication> findByUserId(String userId);
}
""",
    "MockInterviewRepository.java": """package com.placementtracker.backend.repositories;
import com.placementtracker.backend.models.MockInterview;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MockInterviewRepository extends MongoRepository<MockInterview, String> {
    List<MockInterview> findByUserId(String userId);
}
""",
    "ResumeAnalysisRepository.java": """package com.placementtracker.backend.repositories;
import com.placementtracker.backend.models.ResumeAnalysis;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ResumeAnalysisRepository extends MongoRepository<ResumeAnalysis, String> {
    List<ResumeAnalysis> findByUserId(String userId);
    ResumeAnalysis findTopByUserIdOrderByAnalyzedAtDesc(String userId);
}
"""
}

controllers = {
    "CompanyApplicationController.java": """package com.placementtracker.backend.controllers;
import com.placementtracker.backend.models.CompanyApplication;
import com.placementtracker.backend.repositories.CompanyApplicationRepository;
import com.placementtracker.backend.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyApplicationController {
    @Autowired
    private CompanyApplicationRepository repo;

    @GetMapping
    public List<CompanyApplication> getAll(@AuthenticationPrincipal User user) {
        return repo.findByUserId(user.getId());
    }

    @PostMapping
    public CompanyApplication create(@AuthenticationPrincipal User user, @RequestBody CompanyApplication app) {
        app.setUserId(user.getId());
        return repo.save(app);
    }
    
    @PatchMapping("/{id}")
    public CompanyApplication updateStatus(@AuthenticationPrincipal User user, @PathVariable String id, @RequestBody java.util.Map<String, String> payload) {
        CompanyApplication app = repo.findById(id).orElseThrow();
        if(!app.getUserId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        if(payload.containsKey("status")) app.setStatus(payload.get("status"));
        return repo.save(app);
    }
}
""",
    "MockInterviewController.java": """package com.placementtracker.backend.controllers;
import com.placementtracker.backend.models.MockInterview;
import com.placementtracker.backend.repositories.MockInterviewRepository;
import com.placementtracker.backend.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class MockInterviewController {
    @Autowired
    private MockInterviewRepository repo;

    @GetMapping
    public List<MockInterview> getAll(@AuthenticationPrincipal User user) {
        return repo.findByUserId(user.getId());
    }

    @PostMapping
    public MockInterview create(@AuthenticationPrincipal User user, @RequestBody MockInterview interview) {
        interview.setUserId(user.getId());
        return repo.save(interview);
    }
}
""",
    "ResumeAnalysisController.java": """package com.placementtracker.backend.controllers;
import com.placementtracker.backend.models.ResumeAnalysis;
import com.placementtracker.backend.repositories.ResumeAnalysisRepository;
import com.placementtracker.backend.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/resume")
public class ResumeAnalysisController {
    @Autowired
    private ResumeAnalysisRepository repo;

    @GetMapping("/latest")
    public ResumeAnalysis getLatest(@AuthenticationPrincipal User user) {
        return repo.findTopByUserIdOrderByAnalyzedAtDesc(user.getId());
    }

    @PostMapping("/analyze")
    public ResumeAnalysis triggerAnalysis(@AuthenticationPrincipal User user) {
        // Mocking an AI analysis
        ResumeAnalysis analysis = new ResumeAnalysis();
        analysis.setUserId(user.getId());
        analysis.setOverallScore(85);
        analysis.setImpactScore(90);
        analysis.setBrevityScore(80);
        analysis.setSkillsMatchScore(95);
        analysis.setAnalyzedAt(LocalDateTime.now());
        analysis.setCriticalIssues(List.of("Missing metric in experience #2", "Formatting inconsistent on page 2"));
        analysis.setSuggestions(List.of("Add more quantifiable achievements", "Highlight Docker skills better"));
        this.repo.save(analysis);
        return analysis;
    }
}
"""
}

def write_files(directory, file_dict):
    os.makedirs(directory, exist_ok=True)
    for name, content in file_dict.items():
        path = os.path.join(directory, name)
        with open(path, "w") as f:
            f.write(content)
        print(f"Created {path}")

write_files(os.path.join(BASE_DIR, "models"), models)
write_files(os.path.join(BASE_DIR, "repositories"), repos)
write_files(os.path.join(BASE_DIR, "controllers"), controllers)
