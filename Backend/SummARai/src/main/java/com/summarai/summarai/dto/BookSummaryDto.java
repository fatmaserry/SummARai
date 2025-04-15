package com.summarai.summarai.dto;

public class BookSummaryDto {
    private Long id;

    private BookDto book;

    private Long numOfPages ;

    private String summaryPath;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BookDto getBook() {
        return book;
    }

    public void setBook(BookDto book) {
        this.book = book;
    }

    public Long getNumOfPages() {
        return numOfPages;
    }

    public void setNumOfPages(Long numOfPages) {
        this.numOfPages = numOfPages;
    }

    public String getSummaryPath() {
        return summaryPath;
    }

    public void setSummaryPath(String summaryPath) {
        this.summaryPath = summaryPath;
    }
}
