package com.placementtracker.backend.repositories;
import com.placementtracker.backend.models.CompanyApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CompanyApplicationRepository extends MongoRepository<CompanyApplication, String> {
    List<CompanyApplication> findByUserId(String userId);
    List<CompanyApplication> findByUserIdAndCompanyContainingIgnoreCase(String userId, String company);
}
