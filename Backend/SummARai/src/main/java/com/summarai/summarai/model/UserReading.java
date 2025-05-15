package com.summarai.summarai.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(name = "user_reading")
public class UserReading {
    @EmbeddedId
    private UserReadingId id;

    @ManyToOne(fetch = FetchType.EAGER)  // Still lazy by default
    @JoinColumn(name = "summary_id")
    @MapsId("summary_id") // it references the id of this table as the user id
    private Summary summary;

    @ManyToOne()  // Still lazy by default
    @JoinColumn(name = "user_id")
    @MapsId("user_id") // it references the id of this table as the user id
    private User user;

    @CreationTimestamp
    @Column(columnDefinition = "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP",
            updatable = false
    )
    private Date creation_date;

    @Column
    private Long book_mark;

    @Column
    private boolean finished;

    public boolean isFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }

    public Long getBook_mark() {
        return book_mark;
    }

    public Long isBookMark() {
        return book_mark;
    }

    public void setBook_mark(Long bookMark) {
        this.book_mark = bookMark;
    }

    public void setCreation_date(Date creation_date) {
        this.creation_date = creation_date;
    }

    public Date getCreation_date() {
        return creation_date;
    }

    public UserReadingId getId() {
        return id;
    }

    public void setId(UserReadingId id) {
        this.id = id;
    }

    public Summary getSummary() {
        return summary;
    }

    public void setSummary(Summary summary) {
        this.summary = summary;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
