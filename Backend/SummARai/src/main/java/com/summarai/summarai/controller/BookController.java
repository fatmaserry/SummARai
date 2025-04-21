package com.summarai.summarai.controller;

import com.summarai.summarai.dto.BookDto;
import com.summarai.summarai.dto.GenreDto;
import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.model.Book;
import com.summarai.summarai.service.BookService;
import com.summarai.summarai.service.GenreService;
import com.summarai.summarai.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/book")
public class BookController {
    @Autowired
    private BookService bookService;
    @Autowired
    private GenreService genreService;
    @Autowired
    private UserService userService;
    @GetMapping("/allbooks")
    private List<BookDto> getAllBooks(){
        return bookService.findAll();
    }
    @GetMapping("/allgenres")
    private List<GenreDto> getAllGenres(){
        return genreService.findAll();
    }
    @GetMapping("/allusers")
    private List<UserDto> getAllUsers(){
        return userService.findAll();
    }

}
