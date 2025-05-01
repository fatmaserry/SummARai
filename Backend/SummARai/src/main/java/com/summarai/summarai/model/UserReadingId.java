package com.summarai.summarai.model;

import java.io.Serializable;

public class UserReadingId implements Serializable {
    private Long user_id;
    private Long summary_id;

    public UserReadingId(Long user_id, Long summary_id) {
        this.user_id = user_id;
        this.summary_id = summary_id;
    }
}
