package com.executr.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.executr.entity.TestCase;

public interface TestCaseRepository extends JpaRepository<TestCase, Long>{
    
}
