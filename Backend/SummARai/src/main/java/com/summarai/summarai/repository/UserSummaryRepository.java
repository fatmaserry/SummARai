package com.summarai.summarai.repository;

import com.summarai.summarai.model.BookSummary;
import com.summarai.summarai.model.UserSummary;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSummaryRepository extends JpaRepository<UserSummary, Long>, JpaSpecificationExecutor<UserSummary> {
    Page<UserSummary> findAll(Pageable pageable);

    @Query("SELECT s FROM UserSummary s JOIN s.owner u WHERE u.email = :email")
    Page<UserSummary> findMySummaries(String email, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE UserSummary s SET s.is_public = :isPublic WHERE s.id = :summaryId")
    int updateIsPublic(@Param("summaryId") Long summaryId, @Param("isPublic") boolean isPublic);
}