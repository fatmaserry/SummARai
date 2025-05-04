package com.summarai.summarai.model;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "summary_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Summary {
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String title;

    @Column
    private String summary_url;

    @Column
    private String number_of_pages;


    public String getSummary_url() {
        return summary_url;
    }

    public void setSummary_url(String summary_url) {
        this.summary_url = summary_url;
    }

    public String getNumber_of_pages() {
        return number_of_pages;
    }

    public void setNumber_of_pages(String number_of_pages) {
        this.number_of_pages = number_of_pages;
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

}
