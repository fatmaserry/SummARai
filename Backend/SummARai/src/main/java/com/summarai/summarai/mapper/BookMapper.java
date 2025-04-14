package com.summarai.summarai.mapper;

import com.summarai.summarai.dto.BookDto;
import com.summarai.summarai.model.Book;
import com.summarai.summarai.model.Genre;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface BookMapper {

    public BookDto toDto(Book book);
    public Book toEntity(BookDto bookDto);
    public List<BookDto> toDtos(List<Book> books);
    public List<Book> toEntities(List<BookDto> bookDtos);


}
