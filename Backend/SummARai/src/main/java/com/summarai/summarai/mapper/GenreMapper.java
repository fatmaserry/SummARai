package com.summarai.summarai.mapper;

import com.summarai.summarai.dto.GenreDto;
import com.summarai.summarai.model.Genre;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GenreMapper {

    public GenreDto toDto(Genre genre);
    public Genre toEntity(GenreDto genreDto);
    public List<GenreDto> toDtos(List<Genre> genres);
    public List<Genre> toEntities(List<GenreDto> genreDto);


}
