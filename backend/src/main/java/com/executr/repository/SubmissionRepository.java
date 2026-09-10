package com.executr.repository;

import com.executr.entity.Submission;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    /**
     * Checks how many times a user has successfully solved a specific problem.
     * This hits the composite index (user_id, problem_id, status) we defined in the entity,
     * making this query virtually instantaneous even with millions of rows.
     */
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.user.id = :userId AND s.problem.id = :problemId AND s.status = 'ACCEPTED'")
    long countSuccessfulSubmissions(@Param("userId") Long userId, @Param("problemId") Long problemId);

    /**
     * Fetches recent submissions for the Profile page.
     * We use JOIN FETCH to retrieve the associated Problem entity in a single query.
     * Without JOIN FETCH, rendering a list of 5 submissions would trigger 1 query for submissions + 5 separate queries for problem titles (N+1 issue).
     */
    @Query("SELECT s FROM Submission s JOIN FETCH s.problem WHERE s.user.id = :userId ORDER BY s.submittedAt DESC")
    List<Submission> findRecentSubmissionsByUserId(@Param("userId") Long userId, Pageable pageable);
}