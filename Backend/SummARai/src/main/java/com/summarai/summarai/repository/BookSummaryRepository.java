package com.summarai.summarai.repository;

import com.summarai.summarai.model.BookSummary;
import com.summarai.summarai.model.Summary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookSummaryRepository extends JpaRepository<BookSummary, Long>, JpaSpecificationExecutor<BookSummary> {
    Page<BookSummary> findAll(Pageable pageable);
    Page<BookSummary> findByAuthor_Name(String name,Pageable pageable);
    Page<BookSummary> findByTitle(String title, Pageable pageable);
    @Query("select s from BookSummary s where s.normTitle=:title")
    Page<BookSummary> findByNormTitle(String title, Pageable pageable);

    @Query("select s.summary_url from BookSummary s where s.id=:id")
    String findUrlById(@Param("id") Long id);


}