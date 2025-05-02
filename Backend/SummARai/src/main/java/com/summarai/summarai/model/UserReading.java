package com.summarai.summarai.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.Locale;

@Entity
@Table(name = "user_reading")
public class UserReading {
    @EmbeddedId
    private UserReadingId id;

    @ManyToOne(fetch = FetchType.EAGER)  // Still lazy by default
    @JoinColumn(name = "summary_id")
    @MapsId("summary_id") // it references the id of this table as the user id
    private BookSummary bookSummary;

    @ManyToOne(fetch = FetchType.EAGER)  // Still lazy by default
    @JoinColumn(name = "user_id")
    @MapsId("user_id") // it references the id of this table as the user id
    private User user;

    @CreationTimestamp
    @Column(updatable = false,insertable = false)
    private Date creation_date;


    public Date getCreation_date() {
        return creation_date;
    }

    public UserReadingId getId() {
        return id;
    }

    public void setId(UserReadingId id) {
        this.id = id;
    }

    public BookSummary getBookSummary() {
        return bookSummary;
    }

    public void setBookSummary(BookSummary bookSummary) {
        this.bookSummary = bookSummary;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
