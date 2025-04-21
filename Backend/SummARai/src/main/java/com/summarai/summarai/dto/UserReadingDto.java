package com.summarai.summarai.dto;

public class UserReadingDto {
    private Long id;

    private BookSummaryDto bookSummary;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BookSummaryDto getBookSummary() {
        return bookSummary;
    }

    public void setBookSummary(BookSummaryDto bookSummary) {
        this.bookSummary = bookSummary;
    }
}
