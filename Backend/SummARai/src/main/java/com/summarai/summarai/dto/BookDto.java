package com.summarai.summarai.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import org.springframework.stereotype.Component;

import java.util.List;


public class BookDto {
    private Long id;
    private String title;

    private List<GenreDto> genres;
    private String about;
    private AuthorDto author;


    public AuthorDto getAuthor() {
        return author;
    }

    public void setAuthor(AuthorDto author) {
        this.author = author;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }
    public List<GenreDto> getGenres() {
        return genres;
    }

    public void setGenres(List<GenreDto> genres) {
        this.genres = genres;
    }


}
