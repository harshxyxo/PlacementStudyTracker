package com.placementtracker.backend.controllers;

import com.placementtracker.backend.dto.DashboardStats;
import com.placementtracker.backend.models.*;
import com.placementtracker.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.placementtracker.backend.security.CustomUserDetails;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    
    @Autowired private UserProblemProgressRepository progressRepo;
    @Autowired private ProblemRepository problemRepo;
    @Autowired private ResumeAnalysisRepository resumeRepo;
    @Autowired private MockInterviewRepository mockRepo;
    
    @GetMapping("/stats")
    public DashboardStats getStats(@AuthenticationPrincipal CustomUserDetails user) {
        DashboardStats stats = new DashboardStats();
        
        List<UserProblemProgress> solved = progressRepo.findByUserIdAndStatus(user.getId(), "Solved");
        stats.setDsaSolvedCount(solved != null ? solved.size() : 0);
        stats.setDsaTotalCount((int) problemRepo.count());
        if (stats.getDsaTotalCount() == 0) stats.setDsaTotalCount(368); // fallback
        
        ResumeAnalysis latestResume = resumeRepo.findTopByUserIdOrderByAnalyzedAtDesc(user.getId());
        stats.setAtsScore(latestResume != null ? latestResume.getAtsScore() : 0);
        
        stats.setWeeklyReadiness(78); // Hardcoded logic for now, could be derived later
        
        List<MockInterview> upcoming = mockRepo.findByUserIdAndStatus(user.getId(), "Upcoming");
        upcoming.sort((a, b) -> a.getScheduledAt().compareTo(b.getScheduledAt()));
        stats.setUpcomingInterviews(upcoming.size() > 3 ? upcoming.subList(0, 3) : upcoming);
        
        return stats;
    }
}
