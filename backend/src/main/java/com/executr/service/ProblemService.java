package com.executr.service;

import com.executr.entity.Problem;
import com.executr.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;

    public Page<Problem> getPaginatedProblems(String search, String difficulty, Pageable pageable) {
        boolean hasSearch = search != null && !search.trim().isEmpty();
        boolean hasDifficulty = difficulty != null && !difficulty.trim().isEmpty() && !difficulty.equalsIgnoreCase("ALL");

        Problem.Difficulty diffEnum = null;
        if (hasDifficulty && difficulty!=null) {
            try {
                diffEnum = Problem.Difficulty.valueOf(difficulty.toUpperCase());
            } catch (IllegalArgumentException e) {
                hasDifficulty = false;
            }
        }

        if (hasSearch && hasDifficulty && search!=null) {
            return problemRepository.findByTitleContainingIgnoreCaseAndDifficulty(search.trim(), diffEnum, pageable);
        } else if (hasSearch && search!=null) {
            return problemRepository.findByTitleContainingIgnoreCase(search.trim(), pageable);
        } else if (hasDifficulty) {
            return problemRepository.findByDifficulty(diffEnum, pageable);
        } else {
            return problemRepository.findAll(pageable);
        }
    }
}