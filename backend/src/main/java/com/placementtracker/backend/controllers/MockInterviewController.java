package com.placementtracker.backend.controllers;
import com.placementtracker.backend.models.MockInterview;
import com.placementtracker.backend.repositories.MockInterviewRepository;
import com.placementtracker.backend.models.User;
import com.placementtracker.backend.services.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.placementtracker.backend.security.CustomUserDetails;
import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class MockInterviewController {
    @Autowired
    private MockInterviewRepository repo;

    @Autowired
    private ActivityLogService activityLogService;

    @GetMapping
    public List<MockInterview> getAll(@AuthenticationPrincipal CustomUserDetails user) {
        return repo.findByUserId(user.getId());
    }

    @PostMapping
    public MockInterview create(@AuthenticationPrincipal CustomUserDetails user, @RequestBody MockInterview interview) {
        interview.setUserId(user.getId());
        MockInterview saved = repo.save(interview);
        activityLogService.logActivity(user.getId(), "MOCK_SCHEDULED", "Scheduled a mock interview on " + interview.getTopic());
        return saved;
    }
}
