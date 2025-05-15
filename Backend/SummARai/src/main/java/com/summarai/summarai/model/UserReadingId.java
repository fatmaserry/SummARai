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
}
