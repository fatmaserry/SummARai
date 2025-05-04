package com.summarai.summarai.dto;

import com.summarai.summarai.model.Author;
import com.summarai.summarai.model.Genre;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

public class BookSummaryDto extends SummaryDto{
    private String about;

    private Set<GenreDto> genres = new HashSet<>();

    private Author author;

    private String image_url ;

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public Set<GenreDto> getGenres() {
        return genres;
    }

    public void setGenres(Set<GenreDto> genres) {
        this.genres = genres;
    }

    public Author getAuthor() {
        return author;
    }

    public void setAuthor(Author author) {
        this.author = author;
    }

    public String getImage_url() {
        return image_url;
    }

    public void setImage_url(String image_url) {
        this.image_url = image_url;
    }
}
