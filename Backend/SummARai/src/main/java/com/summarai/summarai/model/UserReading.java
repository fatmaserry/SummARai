package com.summarai.summarai.model;

import jakarta.persistence.*;

@Entity
@Table
public class UserReading {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)  // Still lazy by default
    @JoinColumn(name = "summary_id")
    private BookSummary bookSummary;

    @ManyToOne()  // Still lazy by default
    @JoinColumn(name = "user_id")
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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
