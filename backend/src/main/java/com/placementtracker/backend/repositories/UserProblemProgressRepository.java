package com.placementtracker.backend.repositories;

import com.placementtracker.backend.models.UserProblemProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserProblemProgressRepository extends MongoRepository<UserProblemProgress, String> {
    Optional<UserProblemProgress> findByUserIdAndProblemId(String userId, String problemId);
    List<UserProblemProgress> findByUserIdAndStatus(String userId, String status);
}
