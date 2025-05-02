package com.summarai.summarai.service;

import com.summarai.summarai.dto.BookDto;

import com.summarai.summarai.dto.BookSearchRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.Scanner;

public interface BookService {
    public Page<BookDto> getAllBooks(Pageable pageable);

    public Optional<BookDto> getBookById(Long id);

    public Page<BookDto> getBooksByAuthor(String author, Pageable pageable);

    public Page<BookDto> getBooksByTitle(String title, Pageable pageable);

    public Page<BookDto> searchBooks(BookSearchRequest criteria, Pageable pageable);
}
