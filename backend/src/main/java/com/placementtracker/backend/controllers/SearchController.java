package com.placementtracker.backend.controllers;

import com.placementtracker.backend.dto.SearchResult;
import com.placementtracker.backend.models.CompanyApplication;
import com.placementtracker.backend.models.Problem;
import com.placementtracker.backend.repositories.CompanyApplicationRepository;
import com.placementtracker.backend.repositories.ProblemRepository;
import com.placementtracker.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private CompanyApplicationRepository companyApplicationRepository;

    @GetMapping
    public ResponseEntity<List<SearchResult>> search(
            @RequestParam String q,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        List<SearchResult> results = new ArrayList<>();
        
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.ok(results);
        }

        // Search Problems
        List<Problem> problems = problemRepository.findByTitleContainingIgnoreCase(q);
        for (Problem p : problems) {
            results.add(SearchResult.builder()
                    .id(p.getId())
                    .type("PROBLEM")
                    .title(p.getTitle())
                    .subtitle(p.getDifficulty() + " - " + p.getCategory())
                    .url("/dsa")
                    .build());
        }

        // Search Companies
        List<CompanyApplication> companies = companyApplicationRepository
                .findByUserIdAndCompanyContainingIgnoreCase(userDetails.getId(), q);
        for (CompanyApplication c : companies) {
            results.add(SearchResult.builder()
                    .id(c.getId())
                    .type("COMPANY")
                    .title(c.getCompany())
                    .subtitle(c.getRole() + " - " + c.getStatus())
                    .url("/companies")
                    .build());
        }

        return ResponseEntity.ok(results);
    }
}
