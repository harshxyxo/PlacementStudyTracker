package com.placementtracker.backend.repositories;
import com.placementtracker.backend.models.ResumeAnalysis;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ResumeAnalysisRepository extends MongoRepository<ResumeAnalysis, String> {
    List<ResumeAnalysis> findByUserId(String userId);
    ResumeAnalysis findTopByUserIdOrderByAnalyzedAtDesc(String userId);
}
