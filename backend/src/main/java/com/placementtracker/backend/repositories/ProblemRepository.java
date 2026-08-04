package com.placementtracker.backend.repositories;

import com.placementtracker.backend.models.Problem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends MongoRepository<Problem, String> {
    List<Problem> findByTitleContainingIgnoreCase(String title);
}
