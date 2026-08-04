package com.placementtracker.backend.controllers;

import com.placementtracker.backend.dtos.CategoryStatsDTO;
import com.placementtracker.backend.dtos.ProblemDTO;
import com.placementtracker.backend.dtos.UpdateProgressDTO;
import com.placementtracker.backend.models.Problem;
import com.placementtracker.backend.security.CustomUserDetails;
import com.placementtracker.backend.services.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.placementtracker.backend.services.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;

import java.util.List;
import java.util.Map;
import com.placementtracker.backend.services.AiService;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;
    
    @Autowired
    private AiService aiService;
    
    @Autowired
    private ActivityLogService activityLogService;

    @GetMapping
    public ResponseEntity<Page<ProblemDTO>> getProblems(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String userId = userDetails.getId();
        Pageable pageable = PageRequest.of(page, size);
        Page<ProblemDTO> problems = problemService.getProblemsWithProgress(userId, category, difficulty, status, pageable);
        return ResponseEntity.ok(problems);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String id,
            @RequestBody UpdateProgressDTO updateRequest
    ) {
        String userId = userDetails.getId();
        problemService.updateProgress(userId, id, updateRequest.getStatus());
        
        if ("Solved".equals(updateRequest.getStatus())) {
            activityLogService.logActivity(userId, "PROBLEM_SOLVED", "Solved problem: " + id);
        }
        
        return ResponseEntity.ok().build();
    }

    @PostMapping("/custom")
    public ResponseEntity<Problem> addCustomProblem(@RequestBody Problem problem) {
        Problem savedProblem = problemService.addCustomProblem(problem);
        return ResponseEntity.ok(savedProblem);
    }

    @GetMapping("/stats")
    public ResponseEntity<List<CategoryStatsDTO>> getStats(@AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getId();
        List<CategoryStatsDTO> stats = problemService.getCategoryStats(userId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/insights")
    public ResponseEntity<?> getInsights(@AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getId();
        List<CategoryStatsDTO> stats = problemService.getCategoryStats(userId);
        
        for (CategoryStatsDTO stat : stats) {
            if (stat.getTotalProblems() >= 5) {
                double solveRate = (double) stat.getSolvedProblems() / stat.getTotalProblems();
                if (solveRate < 0.4) {
                    String tip = aiService.generateDsaInsight(userId, stat.getCategory(), solveRate);
                    if (tip != null) {
                        return ResponseEntity.ok(Map.of("category", stat.getCategory(), "tip", tip));
                    }
                }
            }
        }
        return ResponseEntity.ok(Map.of());
    }
}
