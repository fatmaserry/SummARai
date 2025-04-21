package com.summarai.summarai.model;

import jakarta.persistence.*;
import org.springframework.stereotype.Component;

import java.util.Date;

@Entity
@Table
public class Statistics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private Long dayStreak;

    private Long maxStreak;
//    private Date currentYear;
    @Column
    private Long totalReadingDays;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    @PostLoad
    private void updateStreak(){
        this.setMaxStreak(Math.max(maxStreak,dayStreak));
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDayStreak() {
        return dayStreak;
    }

    public void setDayStreak(Long dayStreak) {
        this.dayStreak = dayStreak;
    }

    public Long getMaxStreak() {
        return maxStreak;
    }

    public void setMaxStreak(Long maxStreak) {
        this.maxStreak = maxStreak;
    }

    public Long getTotalReadingDays() {
        return totalReadingDays;
    }

    public void setTotalReadingDays(Long totalReadingDays) {
        this.totalReadingDays = totalReadingDays;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
