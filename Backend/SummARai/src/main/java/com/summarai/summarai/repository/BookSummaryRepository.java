package com.summarai.summarai.repository;
import com.summarai.summarai.model.BookSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
@Repository
public interface BookSummaryRepository extends JpaRepository<BookSummary, Long>, JpaSpecificationExecutor<BookSummary> {
    Page<BookSummary> findAll(Pageable pageable);
    Page<BookSummary> findByAuthor_Name(String name,Pageable pageable);
    @Query("select s from BookSummary s where s.normTitle=:title")
    Page<BookSummary> findByNormTitle(String title, Pageable pageable);
    @Query("SELECT s FROM BookSummary s JOIN s.genres g WHERE g.description = :genre")
    Page<BookSummary> findByGenre(String genre, Pageable pageable);


}