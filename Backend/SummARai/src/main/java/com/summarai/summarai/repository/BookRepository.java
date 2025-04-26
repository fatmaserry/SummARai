package com.summarai.summarai.repository;

import com.summarai.summarai.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@Repository
public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
    Page<Book> findAll(Pageable pageable);
    Page<Book> findByAuthor_Name(String name,Pageable pageable);
    Page<Book> findByTitle(String title, Pageable pageable);
}