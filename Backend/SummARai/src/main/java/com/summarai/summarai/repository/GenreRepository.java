package com.summarai.summarai.repository;

import com.summarai.summarai.model.Book;
import com.summarai.summarai.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenreRepository extends JpaRepository<Genre,Long> {

}
