package com.summarai.summarai.mapper;

import com.summarai.summarai.dto.BookDto;
import com.summarai.summarai.model.Book;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper(componentModel = "spring")
public interface BookMapper {

    public BookDto toDto(Book book);
    public Book toEntity(BookDto bookDto);
    public List<BookDto> toDtos(List<Book> books);
    public List<Book> toEntities(List<BookDto> bookDtos);


}
