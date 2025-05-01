package com.summarai.summarai.dto;

import com.summarai.summarai.model.UserReadingId;

public class UserReadingDto {
    private UserReadingId id;

    private BookSummaryDto bookSummary;

    public UserReadingId getId() {
        return id;
    }

    public void setId(UserReadingId id) {
        this.id = id;
    }



    public BookSummaryDto getBookSummary() {
        return bookSummary;
    }

    public void setBookSummary(BookSummaryDto bookSummary) {
        this.bookSummary = bookSummary;
    }
}
