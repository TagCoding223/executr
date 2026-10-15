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

    public Page<Problem> getPaginatedProblems(Pageable pageable) {
        return problemRepository.findAll(pageable); // Uses the repository method[cite: 33]
    }
}