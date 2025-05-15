package com.summarai.summarai.dto;

import com.summarai.summarai.model.UserReadingId;

import java.util.Date;

public class UserReadingDto {
    private UserReadingId id;

    private SummaryDto summaryDto;

    private Long book_mark;
    private Date creation_date;


    private boolean finished;

    public Date getCreation_date() {
        return creation_date;
    }

    public void setCreation_date(Date creation_date) {
        this.creation_date = creation_date;
    }

    public Long getBook_mark() {
        return book_mark;
    }

    public void setBook_mark(Long book_mark) {
        this.book_mark = book_mark;
    }

    public boolean isFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }

    public UserReadingId getId() {
        return id;
    }

    public void setId(UserReadingId id) {
        this.id = id;
    }

    public SummaryDto getSummaryDto() {
        return summaryDto;
    }

    public void setSummaryDto(SummaryDto summaryDto) {
        this.summaryDto = summaryDto;
    }
}
