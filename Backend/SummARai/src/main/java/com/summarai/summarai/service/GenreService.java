package com.summarai.summarai.service;

import com.summarai.summarai.dto.GenreDto;
import com.summarai.summarai.mapper.GenreMapper;
import com.summarai.summarai.repository.GenreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenreService {
    @Autowired
    private GenreRepository genreRepository;
    @Autowired
    private GenreMapper genreMapper;
    public List<GenreDto> findAll(){
        return genreMapper.toDtos(genreRepository.findAll());
    }
}
