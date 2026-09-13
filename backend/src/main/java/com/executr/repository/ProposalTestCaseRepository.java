package com.executr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.executr.entity.ProposalTestCase;

@Repository 
public interface ProposalTestCaseRepository extends JpaRepository<ProposalTestCase, Long>{
}
