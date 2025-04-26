package com.summarai.summarai.service.impl;

import com.summarai.summarai.dto.BookDto;
import com.summarai.summarai.dto.BookSearchRequest;
import com.summarai.summarai.dto.BookSpecs;
import com.summarai.summarai.mapper.BookMapper;
import com.summarai.summarai.model.Book;
import com.summarai.summarai.repository.BookRepository;
import com.summarai.summarai.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookServiceImpl implements BookService {
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private BookMapper bookMapper;
    public Page<BookDto> getAllBooks( Pageable pageable){
        Page<Book> books = bookRepository.findAll(pageable);
        return books.map(bookMapper::toDto);
    }

    public Optional<BookDto> getBookById(Long id) {
        return bookRepository.findById(id)
                .map(book -> bookMapper.toDto(book));  // map the Book to BookDto
    }

    @Override
    public Page<BookDto> getBooksByAuthor(String author, Pageable pageable) {
        Page<Book> books = bookRepository.findByAuthor_Name(author,pageable);
        return books.map(bookMapper::toDto);
    }

    @Override
    public Page<BookDto> getBooksByTitle(String title, Pageable pageable) {
        Page<Book> books = bookRepository.findByTitle(title,pageable);
        return books.map(bookMapper::toDto);
    }

    @Override
    public Page<BookDto> searchBooks(BookSearchRequest criteria, Pageable pageable) {
        Specification<Book> spec = Specification.where(null);

        if (criteria.getAuthor() != null && !criteria.getAuthor().isEmpty()) {
            spec = spec.and(BookSpecs.authorEquals(criteria.getAuthor()));
        }
        if (criteria.getTitle() != null && !criteria.getTitle().isEmpty()) {
            spec = spec.and(BookSpecs.titleContains(criteria.getTitle()));
        }
        List<String> genres = criteria.getGenres();
        if (genres != null && !genres.isEmpty()) {
            spec = spec.and(BookSpecs.hasAnyGenre(genres));
        }

        return bookRepository.findAll(spec, pageable)
                .map(bookMapper::toDto);
    }


}
