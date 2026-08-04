package com.placementtracker.backend.repositories;

import com.placementtracker.backend.models.DailyTask;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;

public interface DailyTaskRepository extends MongoRepository<DailyTask, String> {
    List<DailyTask> findByUserIdAndDate(String userId, LocalDate date);
}
