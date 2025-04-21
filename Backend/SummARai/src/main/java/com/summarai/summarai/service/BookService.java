package com.summarai.summarai.service;

import com.summarai.summarai.dto.BookDto;
import com.summarai.summarai.mapper.BookMapper;
import com.summarai.summarai.model.Book;
import com.summarai.summarai.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private BookMapper bookMapper;
    public List<BookDto> findAll(){
        return bookMapper.toDtos(bookRepository.findAll());
    }
}
