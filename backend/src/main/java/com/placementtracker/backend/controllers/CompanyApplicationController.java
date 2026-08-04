package com.placementtracker.backend.controllers;
import com.placementtracker.backend.models.CompanyApplication;
import com.placementtracker.backend.repositories.CompanyApplicationRepository;
import com.placementtracker.backend.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.placementtracker.backend.security.CustomUserDetails;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyApplicationController {
    @Autowired
    private CompanyApplicationRepository repo;

    @Autowired
    private com.placementtracker.backend.services.AiService aiService;

    @GetMapping
    public List<CompanyApplication> getAll(@AuthenticationPrincipal CustomUserDetails user) {
        return repo.findByUserId(user.getId());
    }

    @PostMapping
    public CompanyApplication create(@AuthenticationPrincipal CustomUserDetails user, @RequestBody CompanyApplication app) {
        app.setUserId(user.getId());
        if ("OA/Interview".equals(app.getStatus())) {
            app.setPrepTopics(aiService.generatePrepTopics(app.getRole()));
        }
        return repo.save(app);
    }
    
    @PatchMapping("/{id}")
    public CompanyApplication updateStatus(@AuthenticationPrincipal CustomUserDetails user, @PathVariable String id, @RequestBody java.util.Map<String, String> payload) {
        CompanyApplication app = repo.findById(id).orElseThrow();
        if(!app.getUserId().equals(user.getId())) throw new RuntimeException("Unauthorized");
        if(payload.containsKey("status")) {
            String newStatus = payload.get("status");
            app.setStatus(newStatus);
            if ("OA/Interview".equals(newStatus) && (app.getPrepTopics() == null || app.getPrepTopics().isEmpty())) {
                app.setPrepTopics(aiService.generatePrepTopics(app.getRole()));
            }
        }
        return repo.save(app);
    }
}
