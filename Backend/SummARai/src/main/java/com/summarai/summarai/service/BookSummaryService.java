package com.summarai.summarai.service;

import com.summarai.summarai.dto.BookSummaryDto;
import com.summarai.summarai.dto.SummaryDto;

import com.summarai.summarai.dto.BookSearchRequest;
import com.summarai.summarai.model.BookSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface BookSummaryService {
    public Page<BookSummaryDto> getAllBooks(Pageable pageable);

    public Optional<BookSummaryDto> getBookById(Long id);

    public Page<BookSummaryDto> getBooksByAuthor(String author, Pageable pageable);

    public Page<BookSummaryDto> getBooksByTitle(String title, Pageable pageable);

    public Page<BookSummaryDto> searchBooks(BookSearchRequest criteria, Pageable pageable);
}
