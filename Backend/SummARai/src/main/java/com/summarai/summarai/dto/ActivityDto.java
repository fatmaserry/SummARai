package com.summarai.summarai.dto;

import java.time.LocalDate;


public class ActivityDto {
    private LocalDate date;
    private Integer level;

    public ActivityDto(LocalDate date, Integer level) {
        this.date = date;
        this.level = level;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }
}
