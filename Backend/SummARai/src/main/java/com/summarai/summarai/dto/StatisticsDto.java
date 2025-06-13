package com.summarai.summarai.dto;

public class StatisticsDto {
    private Long id;
    private Long dayStreak;
    private Long maxStreak;
    private Long totalReadingDays;
    private String dailyActivity;

    public String getDailyActivity() {
        return dailyActivity;
    }

    public void setDailyActivity(String dailyActivity) {
        this.dailyActivity = dailyActivity;
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


}
