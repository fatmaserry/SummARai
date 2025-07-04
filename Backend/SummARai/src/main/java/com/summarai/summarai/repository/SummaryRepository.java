package com.summarai.summarai.repository;

import com.summarai.summarai.model.Summary;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;


@Repository
public interface SummaryRepository extends JpaRepository<Summary, Long>, JpaSpecificationExecutor<Summary> {
    Page<Summary> findAll(Pageable pageable);

    @Query("select s.summary_url from Summary s where s.id=:id")
    String findUrlById(Long id);
}