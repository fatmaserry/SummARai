package com.summarai.summarai.dto;

import jakarta.persistence.Column;

import java.util.List;


public abstract class SummaryDto {
    private Long id;
    private String title;
    private String summary_url;
    private Long number_of_pages;
    private String summaryType;

    public String getSummaryType() {
        return summaryType;
    }

    public void setSummaryType(String summaryType) {
        this.summaryType = summaryType;
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
}
