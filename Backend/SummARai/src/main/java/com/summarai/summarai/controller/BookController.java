package com.summarai.summarai.controller;

import com.summarai.summarai.dto.BookDto;
import com.summarai.summarai.dto.GenreDto;
import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.model.Book;
import com.summarai.summarai.service.BookService;
import com.summarai.summarai.service.GenreService;
import com.summarai.summarai.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/book")
@AllArgsConstructor
public class BookController {

//    private final BookService bookService;
//    private final GenreService genreService;
//    @GetMapping("/allbooks")
//    public List<BookDto> getAllBooks(){
//        return bookService.findAll();
//    }
//    @GetMapping("/allgenres")
//    public List<GenreDto> getAllGenres(){
//        return genreService.findAll();
//    }


}
