package com.summarai.summarai.repository;

import com.summarai.summarai.model.BookSummary;
import com.summarai.summarai.model.UserSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSummaryRepository extends JpaRepository<UserSummary, Long>, JpaSpecificationExecutor<UserSummary> {
    Page<UserSummary> findAll(Pageable pageable);
}