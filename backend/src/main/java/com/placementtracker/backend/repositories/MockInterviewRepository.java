package com.placementtracker.backend.repositories;
import com.placementtracker.backend.models.MockInterview;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MockInterviewRepository extends MongoRepository<MockInterview, String> {
    List<MockInterview> findByUserId(String userId);
    List<MockInterview> findByUserIdAndStatus(String userId, String status);
}
