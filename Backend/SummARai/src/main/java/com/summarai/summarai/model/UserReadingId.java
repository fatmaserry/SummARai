package com.summarai.summarai.model;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class UserReadingId implements Serializable {
    private Long user_id;
    private Long summary_id;

    public UserReadingId(Long user_id, Long summary_id) {
        this.user_id = user_id;
        this.summary_id = summary_id;
    }

    public UserReadingId() {

    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public Long getSummary_id() {
        return summary_id;
    }

    public void setSummary_id(Long summary_id) {
        this.summary_id = summary_id;
    }
}
