package com.summarai.summarai.controller;

import com.summarai.summarai.dto.BookDto;

import com.summarai.summarai.dto.BookSearchRequest;
import com.summarai.summarai.service.BookService;
import com.summarai.summarai.service.GenreService;
import com.summarai.summarai.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/books")
public class BookController {
    @Autowired
    private BookService bookService;
    @Autowired
    private GenreService genreService;
    @Autowired
    private UserService userService;

    @GetMapping()
    public ResponseEntity<Page<BookDto>> getAllBooks(Pageable pageable) {
        Page<BookDto> books = bookService.getAllBooks(pageable);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @GetMapping("/{book_id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable Long book_id) {
        return bookService.getBookById(book_id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping(params = "title")
    public ResponseEntity<Page<BookDto>> getBooksByTitle(@RequestParam String title, Pageable pageable) {
        Page<BookDto> books = bookService.getBooksByTitle(title, pageable);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @GetMapping(params = "author")
    public ResponseEntity<Page<BookDto>> getBooksByAuthor(@RequestParam String author, Pageable pageable) {
        Page<BookDto> books = bookService.getBooksByAuthor(author, pageable);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @PostMapping("/search")
    public ResponseEntity<Page<BookDto>> search(@RequestBody BookSearchRequest criteria, Pageable pageable) {
        Page<BookDto> books = bookService.searchBooks(criteria, pageable);
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
