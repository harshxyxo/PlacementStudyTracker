package com.placementtracker.backend.services;

import com.placementtracker.backend.dtos.CategoryStatsDTO;
import com.placementtracker.backend.dtos.ProblemDTO;
import com.placementtracker.backend.models.Problem;
import com.placementtracker.backend.models.UserProblemProgress;
import com.placementtracker.backend.repositories.ProblemRepository;
import com.placementtracker.backend.repositories.UserProblemProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("unchecked")
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final UserProblemProgressRepository progressRepository;

    public Page<ProblemDTO> getProblemsWithProgress(String userId, String category, String difficulty, String status, Pageable pageable) {
        List<Problem> allProblems = problemRepository.findAll();

        if (category != null && !category.isEmpty()) {
            allProblems = allProblems.stream().filter(p -> p.getCategory().equalsIgnoreCase(category)).collect(Collectors.toList());
        }
        if (difficulty != null && !difficulty.isEmpty()) {
            allProblems = allProblems.stream().filter(p -> p.getDifficulty().equalsIgnoreCase(difficulty)).collect(Collectors.toList());
        }

        List<UserProblemProgress> userProgress = progressRepository.findAll().stream()
                .filter(p -> p.getUserId().equals(userId))
                .collect(Collectors.toList());
        Map<String, String> statusMap = userProgress.stream()
                .collect(Collectors.toMap(UserProblemProgress::getProblemId, UserProblemProgress::getStatus));

        List<ProblemDTO> problemDTOs = allProblems.stream().map(problem -> {
            String currentStatus = statusMap.getOrDefault(problem.getId(), "Unsolved");
            
            return ProblemDTO.builder()
                    .id(problem.getId())
                    .title(problem.getTitle())
                    .category(problem.getCategory())
                    .difficulty(problem.getDifficulty())
                    .leetcodeLink(problem.getLeetcodeLink())
                    .status(currentStatus)
                    .build();
        }).collect(Collectors.toList());

        if (status != null && !status.isEmpty()) {
            problemDTOs = problemDTOs.stream().filter(p -> p.getStatus().equalsIgnoreCase(status)).collect(Collectors.toList());
        }

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), problemDTOs.size());
        
        List<ProblemDTO> pagedList = start > problemDTOs.size() ? List.<ProblemDTO>of() : problemDTOs.subList(start, end);

        return new PageImpl<>(pagedList, pageable, problemDTOs.size());
    }

    public void updateProgress(String userId, String problemId, String status) {
        Optional<UserProblemProgress> existing = progressRepository.findByUserIdAndProblemId(userId, problemId);
        
        if (existing.isPresent()) {
            UserProblemProgress progress = existing.get();
            progress.setStatus(status);
            progressRepository.save(progress);
        } else {
            UserProblemProgress progress = UserProblemProgress.builder()
                    .userId(userId)
                    .problemId(problemId)
                    .status(status)
                    .build();
            progressRepository.save(progress);
        }
    }

    public Problem addCustomProblem(Problem problem) {
        return problemRepository.save(problem);
    }

    public List<CategoryStatsDTO> getCategoryStats(String userId) {
        List<Problem> allProblems = problemRepository.findAll();
        
        Map<String, Long> totalByCategory = allProblems.stream()
                .collect(Collectors.groupingBy(Problem::getCategory, Collectors.counting()));
                
        List<UserProblemProgress> userProgress = progressRepository.findAll().stream()
                .filter(p -> p.getUserId().equals(userId) && "Solved".equalsIgnoreCase(p.getStatus()))
                .collect(Collectors.toList());
                
        Map<String, Long> solvedByProblemId = userProgress.stream()
                .collect(Collectors.groupingBy(UserProblemProgress::getProblemId, Collectors.counting()));
                
        Map<String, Long> solvedByCategory = allProblems.stream()
                .filter(p -> solvedByProblemId.containsKey(p.getId()))
                .collect(Collectors.groupingBy(Problem::getCategory, Collectors.counting()));

        return totalByCategory.entrySet().stream().map(entry -> {
            String category = entry.getKey();
            long total = entry.getValue();
            long solved = solvedByCategory.getOrDefault(category, 0L);
            return new CategoryStatsDTO(category, total, solved);
        }).collect(Collectors.toList());
    }
}
