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
    private Long number_of_pages;

    @Column(name = "summary_type", insertable = false, updatable = false)
    private String summaryType;

    public String getSummaryType() {
        return summaryType;
    }

    public void setSummaryType(String summaryType) {
        this.summaryType = summaryType;
    }

    public String getSummary_url() {
        return summary_url;
    }

    public void setSummary_url(String summary_url) {
        this.summary_url = summary_url;
    }

    public Long getNumber_of_pages() {
        return number_of_pages;
    }

    public void setNumber_of_pages(Long number_of_pages) {
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
