package com.summarai.summarai.controller;

import com.summarai.summarai.dto.BookSummaryDto;
import com.summarai.summarai.dto.SummaryDto;

import com.summarai.summarai.dto.BookSearchRequest;
import com.summarai.summarai.service.BookSummaryService;
import com.summarai.summarai.service.GenreService;
import com.summarai.summarai.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/books")
public class BookController {
    @Autowired
    private BookSummaryService bookSummaryService;
    @Autowired
    private GenreService genreService;
    @Autowired
    private UserService userService;

    @GetMapping()
    public ResponseEntity<Page<BookSummaryDto>> getAllBooks(Pageable pageable) {
        Page<BookSummaryDto> books = bookSummaryService.getAllBooks(pageable);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @GetMapping("/{book_id}")
    public ResponseEntity<BookSummaryDto> getBookById(@PathVariable Long book_id) {
        return bookSummaryService.getBookById(book_id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping(params = "title")
    public ResponseEntity<Page<BookSummaryDto>> getBooksByTitle(@RequestParam String title, Pageable pageable) {
        Page<BookSummaryDto> books = bookSummaryService.getBooksByTitle(title, pageable);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @GetMapping(params = "author")
    public ResponseEntity<Page<BookSummaryDto>> getBooksByAuthor(@RequestParam String author, Pageable pageable) {
        Page<BookSummaryDto> books = bookSummaryService.getBooksByAuthor(author, pageable);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @PostMapping("/search")
    public ResponseEntity<Page<BookSummaryDto>> search(@RequestBody BookSearchRequest criteria, Pageable pageable) {
        Page<BookSummaryDto> books = bookSummaryService.searchBooks(criteria, pageable);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

//    @GetMapping("/allGenres")
//    private List<GenreDto> getAllGenres(){
//        return genreService.getAllGenres();
//    }
//    @GetMapping("/allusers")
//    private List<UserDto> getAllUsers(){
//        return userService.getAllUsers();
//    }

}
