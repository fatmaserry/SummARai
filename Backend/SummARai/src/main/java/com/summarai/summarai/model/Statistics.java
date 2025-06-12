package com.summarai.summarai.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.time.LocalDate;
@Entity
@Table
public class Statistics {
    @Id
    private Long id;
    @Column
    private Long dayStreak;
    @Column
    private Long maxStreak;
//    private Date currentYear;
    @Column
    private Long totalReadingDays;

    @Column(length = 365)
    private String dailyActivity;
    @Column
    private LocalDate lastUpdated;

    @OneToOne(optional = false)
    @MapsId
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    public Statistics() {
        this.lastUpdated = LocalDate.now();
        this.setMaxStreak(0L);
        this.setTotalReadingDays(0L);
        this.setDayStreak(0L);
        this.setDailyActivity("0".repeat(365));
    }
    public Statistics(User user) {
        this.user = user;
        this.setMaxStreak(0L);
        this.setTotalReadingDays(0L);
        this.setDayStreak(0L);
        this.lastUpdated = LocalDate.now();
        this.setDailyActivity("0".repeat(365));
    }

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

    public LocalDate getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDate lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getDailyActivity() {
        return dailyActivity;
    }

    public void setDailyActivity(String dailyActivity) {
        this.dailyActivity = dailyActivity;
    }
}
