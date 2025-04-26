package com.summarai.summarai.service.impl;

import com.summarai.summarai.dto.GenreDto;
import com.summarai.summarai.mapper.GenreMapper;
import com.summarai.summarai.repository.GenreRepository;
import com.summarai.summarai.service.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenreServiceImpl implements GenreService {
    @Autowired
    private GenreRepository genreRepository;
    @Autowired
    private GenreMapper genreMapper;
    public List<GenreDto> getAllGenres() {
        return genreMapper.toDtos(genreRepository.findAll());
    }
}
