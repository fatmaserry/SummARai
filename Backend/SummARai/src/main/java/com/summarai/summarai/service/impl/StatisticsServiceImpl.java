package com.summarai.summarai.service.impl;

import com.amazonaws.services.kms.model.NotFoundException;
import com.summarai.summarai.dto.GenreCountDTO;
import com.summarai.summarai.dto.StatisticsDto;
import com.summarai.summarai.mapper.StatisticsMapper;
import com.summarai.summarai.model.Statistics;
import com.summarai.summarai.model.User;
import com.summarai.summarai.model.UserReading;
import com.summarai.summarai.repository.ReadingsRepository;
import com.summarai.summarai.repository.StatisticsRepository;
import com.summarai.summarai.repository.UserRepository;
import com.summarai.summarai.security.UserDetailsServiceImpl;
import com.summarai.summarai.service.StatisticsService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class StatisticsServiceImpl implements StatisticsService {
    private final StatisticsRepository statisticsRepository;
    private final ReadingsRepository readingsRepository;
    private final StatisticsMapper statisticsMapper;
    private final UserDetailsServiceImpl userDetailsService;

    public StatisticsServiceImpl(StatisticsRepository statisticsRepository, ReadingsRepository readingsRepository,StatisticsMapper statisticsMapper, UserDetailsServiceImpl userDetailsService) {
        this.statisticsRepository = statisticsRepository;
        this.readingsRepository = readingsRepository;
        this.statisticsMapper = statisticsMapper;
        this.userDetailsService = userDetailsService;
    }

    public StatisticsDto getStatistics() {
        Statistics stats = statisticsRepository
                .getStatisticsByUserId(userDetailsService.getCurrentUser().getId());
        return statisticsMapper.toDto(stats);
    }

    public void updateStatistics(){
        Statistics stats = statisticsRepository
                .getStatisticsByUserId(userDetailsService.getCurrentUser().getId());

        long daysBetween = 365;
        if (stats.getLastUpdated() != null){
            daysBetween = ChronoUnit.DAYS.between(stats.getLastUpdated(), LocalDate.now());
        }
        String newDailyActivity = "";
        if (stats.getDailyActivity() == null){
            newDailyActivity = '1' + "0".repeat(364);
        }
        else{
            newDailyActivity = shiftDays(stats.getDailyActivity(),(int) daysBetween);
        }
        stats.setDailyActivity(newDailyActivity);
        stats.setLastUpdated(LocalDate.now());
        stats.setDayStreak(getNewDayStreak(daysBetween,stats.getDayStreak()));
        stats.setMaxStreak(Math.max(stats.getMaxStreak(),stats.getDayStreak()));
        if (daysBetween > 0){
            stats.setTotalReadingDays(stats.getTotalReadingDays() + 1);
        }
        statisticsRepository.save(stats);
    }

    public Long getTotalReadingSummaries() {
        return readingsRepository.countByUserIdAndFinished(userDetailsService.getCurrentUser().getId(),true);
    }


    public List<GenreCountDTO> getTotalNumberOfSummariesByGenre(){
        return readingsRepository
                .getGenreCountsByUserId(userDetailsService.getCurrentUser().getId());
    }


    private String shiftDays(String activity, int daysToShift) {
        if (daysToShift <= 0) return activity;
        int length = activity.length();
        if (daysToShift >= length) {
            // reset everything
            return '1' + "0".repeat(length - 1);
        }
        String zeros = '1' + "0".repeat(daysToShift - 1);
        String trimmed = activity.substring(0, length - daysToShift);
        return zeros + trimmed;
    }

    private Long getNewDayStreak(long daysBetween,long daysStreak){
        try{
            if (daysBetween < 0)throw new Exception("Days not valid");
        }
        catch (Exception e){
            System.out.println(e.getMessage());
        }
        if (daysBetween <= 1){
            return daysStreak + daysBetween;
        }
        return 1L;
    }
}
