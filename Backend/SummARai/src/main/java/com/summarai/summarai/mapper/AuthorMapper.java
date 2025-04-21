package com.summarai.summarai.mapper;

import com.summarai.summarai.dto.AuthorDto;
import com.summarai.summarai.dto.BookDto;
import com.summarai.summarai.model.Author;
import com.summarai.summarai.model.Book;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AuthorMapper {

    public AuthorDto toDto(Author author);
    public Author toEntity(AuthorDto authorDto);
    public List<AuthorDto> toDtos(List<Author> authors);
    public List<Author> toEntities(List<AuthorDto> authorDtos);


}
