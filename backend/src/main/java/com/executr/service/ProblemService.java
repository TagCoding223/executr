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

    public Page<Problem> getPaginatedProblems(String search, Pageable pageable) {
        if (search != null && !search.trim().isEmpty()) {
            return problemRepository.findByTitleContainingIgnoreCase(search.trim(), pageable);
        }
        return problemRepository.findAll(pageable);
    }
}