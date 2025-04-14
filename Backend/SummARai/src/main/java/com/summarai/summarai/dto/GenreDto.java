package com.summarai.summarai.dto;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.summarai.summarai.model.Book;
import jakarta.persistence.*;

import java.util.List;

public class GenreDto {

    private Long id;
    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
