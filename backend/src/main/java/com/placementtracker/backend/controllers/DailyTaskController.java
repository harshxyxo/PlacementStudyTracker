package com.placementtracker.backend.controllers;

import com.placementtracker.backend.models.DailyTask;
import com.placementtracker.backend.repositories.DailyTaskRepository;
import com.placementtracker.backend.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.placementtracker.backend.security.CustomUserDetails;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class DailyTaskController {
    
    @Autowired
    private DailyTaskRepository repo;
    
    @GetMapping("/today")
    public List<DailyTask> getTodayTasks(@AuthenticationPrincipal CustomUserDetails user) {
        LocalDate today = LocalDate.now();
        List<DailyTask> tasks = repo.findByUserIdAndDate(user.getId(), today);
        if (tasks.isEmpty()) {
            DailyTask t1 = new DailyTask();
            t1.setUserId(user.getId());
            t1.setTitle("Solve 2 LeetCode Mediums");
            t1.setDescription("Focus on Dynamic Programming");
            t1.setCompleted(false);
            t1.setDate(today);
            
            DailyTask t2 = new DailyTask();
            t2.setUserId(user.getId());
            t2.setTitle("Update Resume Bullets");
            t2.setDescription("Incorporate STAR method for latest project");
            t2.setCompleted(false);
            t2.setDate(today);
            
            DailyTask t3 = new DailyTask();
            t3.setUserId(user.getId());
            t3.setTitle("Mock Interview");
            t3.setDescription("Schedule 45m session with Peer Group A");
            t3.setCompleted(false);
            t3.setDate(today);
            
            repo.saveAll(List.of(t1, t2, t3));
            tasks = List.of(t1, t2, t3);
        }
        return tasks;
    }
    
    @PatchMapping("/{id}/toggle")
    public DailyTask toggleTask(@AuthenticationPrincipal CustomUserDetails user, @PathVariable String id, @RequestBody java.util.Map<String, Boolean> body) {
        DailyTask task = repo.findById(id).orElseThrow();
        if (!task.getUserId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        task.setCompleted(body.get("completed"));
        return repo.save(task);
    }
}
