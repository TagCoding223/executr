package com.executr.repository;

import com.executr.entity.Problem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
    // Used for the URL routing, e.g., /problem/two-sum
    Optional<Problem> findBySlug(String slug);
    
    // Automatically handles paginated lists for the Problems directory
    Page<Problem> findAll(Pageable pageable);

    // Added for searching problems by title dynamically
    Page<Problem> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    long countByDifficulty(Problem.Difficulty difficulty);
}