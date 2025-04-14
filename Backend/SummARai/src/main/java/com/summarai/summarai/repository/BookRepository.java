package com.summarai.summarai.repository;

import com.summarai.summarai.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book,Long> {

}
