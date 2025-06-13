package com.summarai.summarai.service.impl;

import com.summarai.summarai.dto.BookSummaryDto;
import com.summarai.summarai.dto.BookSearchRequest;
import com.summarai.summarai.dto.BookSpecs;
import com.summarai.summarai.mapper.BookSummaryMapper;
import com.summarai.summarai.mapper.SummaryMapper;
import com.summarai.summarai.model.BookSummary;
import com.summarai.summarai.repository.BookSummaryRepository;
import com.summarai.summarai.service.BookSummaryService;
import com.summarai.summarai.service.S3Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class BookSummaryServiceImpl implements BookSummaryService {
    private final BookSummaryRepository bookSummaryRepository;
    private final BookSummaryMapper summaryMapper;
    private final S3Service s3Service;

    public BookSummaryServiceImpl(BookSummaryRepository summaryRepository, BookSummaryMapper summaryMapper, S3Service s3Service) {
        this.bookSummaryRepository = summaryRepository;
        this.summaryMapper = summaryMapper;
        this.s3Service = s3Service;
    }
    public BookSummary saveBook(BookSummaryDto bookSummary, MultipartFile file) throws IOException {
        String filename =s3Service.uploadFile(file);
        bookSummary.setSummary_url(filename);
        return this.bookSummaryRepository.save(summaryMapper.toEntity(bookSummary));
    }
    public List<BookSummary> saveBooks(List<BookSummaryDto> bookSummaries,List<MultipartFile> file){
        return this.bookSummaryRepository.saveAll(summaryMapper.toEntities(bookSummaries));
    }
    public String getSummaryURL(Long id){
        return this.bookSummaryRepository.findUrlById(id);
    }

    public Page<BookSummaryDto> getAllBooks(Pageable pageable){
        Page<BookSummary> books = bookSummaryRepository.findAll(pageable);
        return books.map(summaryMapper::toDto);
    }

    public Optional<BookSummaryDto> getBookById(Long id) {
        return bookSummaryRepository.findById(id)
                .map(book -> summaryMapper.toDto(book));  // map the Book to BookDto
    }

    @Override
    public Page<BookSummaryDto> getBooksByAuthor(String author, Pageable pageable) {
        Page<BookSummary> books = bookSummaryRepository.findByAuthor_Name(author,pageable);
        return books.map(summaryMapper::toDto);
    }

    @Override
    public Page<BookSummaryDto> getBooksByTitle(String title, Pageable pageable) {
        Page<BookSummary> books = bookSummaryRepository.findByTitle(title,pageable);
        return books.map(summaryMapper::toDto);
    }

    @Override
    public Page<BookSummaryDto> searchBooks(BookSearchRequest criteria, Pageable pageable) {
        Specification<BookSummary> spec = Specification.where(null);

        if (criteria.getAuthor() != null && !criteria.getAuthor().isEmpty()) {
            spec = spec.and(BookSpecs.authorContains(criteria.getAuthor()));
        }
        if (criteria.getTitle() != null && !criteria.getTitle().isEmpty()) {
            spec = spec.and(BookSpecs.titleContains(criteria.getTitle()));
        }
        List<String> genres = criteria.getGenres();
        if (genres != null && !genres.isEmpty()) {
            spec = spec.and(BookSpecs.hasAnyGenre(genres));
        }

        return bookSummaryRepository.findAll(spec, pageable)
                .map(summaryMapper::toDto);
    }


}
