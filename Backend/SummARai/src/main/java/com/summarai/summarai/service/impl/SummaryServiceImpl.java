package com.summarai.summarai.service.impl;

import com.summarai.summarai.dto.*;
import com.summarai.summarai.exception.SummaryNotFoundException;
import com.summarai.summarai.exception.UnAuthorizedOperationException;
import com.summarai.summarai.mapper.BookSummaryMapper;
import com.summarai.summarai.mapper.SummaryMapper;
import com.summarai.summarai.mapper.UserSummaryMapper;
import com.summarai.summarai.model.BookSummary;
import com.summarai.summarai.model.Summary;
import com.summarai.summarai.model.UserSummary;
import com.summarai.summarai.repository.BookSummaryRepository;
import com.summarai.summarai.repository.ReadingsRepository;
import com.summarai.summarai.repository.SummaryRepository;
import com.summarai.summarai.repository.UserSummaryRepository;
import com.summarai.summarai.security.UserDetailsServiceImpl;
import com.summarai.summarai.service.SummaryService;
import com.summarai.summarai.service.S3Service;
import com.summarai.summarai.service.search.SearchFactory;
import com.summarai.summarai.service.search.SystemSearchFactory;
import com.summarai.summarai.service.search.UserGeneratedSearchFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class SummaryServiceImpl implements SummaryService {
    private final BookSummaryRepository bookSummaryRepository;
    private final UserSummaryRepository userSummaryRepository;
    private final ReadingsRepository readingsRepository;
    private final SummaryRepository summaryRepository;
    private final SummaryMapper summaryMapper;
    private final BookSummaryMapper bookSummaryMapper;
    private final UserSummaryMapper userSummaryMapper;
    private final S3Service s3Service;

    public SummaryServiceImpl(BookSummaryRepository summaryRepository, UserSummaryRepository userSummaryRepository, SummaryRepository summaryRepository1, SummaryMapper summaryMapper1, BookSummaryMapper summaryMapper, UserSummaryMapper userSummaryMapper, S3Service s3Service, UserDetailsServiceImpl userDetailsService, ReadingsRepository readingsRepository) {
        this.bookSummaryRepository = summaryRepository;
        this.userSummaryRepository = userSummaryRepository;
        this.summaryRepository = summaryRepository1;
        this.summaryMapper = summaryMapper1;
        this.bookSummaryMapper = summaryMapper;
        this.userSummaryMapper = userSummaryMapper;
        this.s3Service = s3Service;
        this.readingsRepository = readingsRepository;
    }

    public BookSummary saveBook(BookSummaryDto bookSummary, MultipartFile file) throws IOException {
        String filename = s3Service.uploadFile(file);
        bookSummary.setSummary_url(filename);
        BookSummary book = bookSummaryMapper.toEntity(bookSummary);
        book.setNormTitle(Normalizer.normalizeArabic(book.getTitle()));
        return this.bookSummaryRepository.save(book);
    }

    public List<BookSummary> saveBooks(List<BookSummaryDto> bookSummaries, List<MultipartFile> file) {
        return this.bookSummaryRepository.saveAll(bookSummaryMapper.toEntities(bookSummaries));
    }

    public String getSummaryURL(Long id) {
        return this.bookSummaryRepository.findUrlById(id);
    }

    @Override
    public Page<UserSummaryDto> getMySummaries(Pageable pageable) {
        return userSummaryRepository.findMySummaries(UserDetailsServiceImpl.getCurrentUsername(), pageable).map(userSummaryMapper::toDto);
    }

    @Override
    public boolean updateSummaryStatus(Long summaryId, Boolean status) {
        boolean isOnwer = false;
        if (userSummaryRepository.findById(summaryId).isPresent()) {
            UserSummary userSummary = userSummaryRepository.findById(summaryId).get();
            if (Objects.equals(userSummary.getOwner().getEmail(), UserDetailsServiceImpl.getCurrentUsername()))
                isOnwer = true;
        }
        if (!isOnwer) {
            throw new UnAuthorizedOperationException("You are not the Owner of this Summary");
        } else {
            userSummaryRepository.updateIsPublic(summaryId, status);
            if (!status) {
                readingsRepository.deleteBySummaryId(summaryId);
            }

        }
        return isOnwer;
    }

    public Page<BookSummaryDto> getAllBooks(Pageable pageable) {
        Page<BookSummary> books = bookSummaryRepository.findAll(pageable);
        return books.map(bookSummaryMapper::toDto);
    }

    @Override
    public Page<BookSummaryDto> getBooksByGenre(String genre, Pageable pageable) {
        return bookSummaryRepository.findByGenre(genre, pageable).map(bookSummaryMapper::toDto);
    }

    public Optional<SummaryDto> getBookById(Long id) {
        Summary summary = summaryRepository.findById(id)
                .orElseThrow(() -> new SummaryNotFoundException("Book not found"));
        if (summary instanceof UserSummary) {
            UserSummary userSummary = (UserSummary) summary;
            if (!userSummary.getIs_public() && !userSummary.getOwner().getEmail().equals(UserDetailsServiceImpl.getCurrentUsername())) {
                throw new UnAuthorizedOperationException("Book Is Private.");
            }
        }
        return summaryRepository.findById(id)
                .map(summaryMapper::toDto);
    }

    @Override
    public Page<BookSummaryDto> getBooksByAuthor(String author, Pageable pageable) {
        Page<BookSummary> books = bookSummaryRepository.findByAuthor_Name(author, pageable);
        return books.map(bookSummaryMapper::toDto);
    }

    @Override
    public Page<BookSummaryDto> getBooksByTitle(String title, Pageable pageable) {

        Page<BookSummary> books = bookSummaryRepository.findByNormTitle(Normalizer.normalizeArabic(title), pageable);
        return books.map(bookSummaryMapper::toDto);
    }

    @Override
    public Page<?> searchBooks(BookSearchRequest criteria, Pageable pageable) {
        SearchFactory searchType;
        if (criteria.getType() == SummaryType.BOOK) {
            searchType = new SystemSearchFactory(bookSummaryRepository, bookSummaryMapper);
        } else
            searchType = new UserGeneratedSearchFactory(userSummaryRepository, userSummaryMapper);

        return searchType.CreateSearch(criteria, pageable);
    }

//    @Transactional
//    public void normalizeExistingBooks(){
//        List<BookSummary> books = bookSummaryRepository.findAll();
//        for(BookSummary book : books){
//            book.setNorm_title(normalizeArabic(book.getTitle()));
//            System.out.println(book.getNorm_title());
//        }
//        bookSummaryRepository.saveAll(books);
//    }


}
