package com.summarai.summarai.service;

import com.summarai.summarai.dto.GenreCountDTO;
import com.summarai.summarai.dto.StatisticsDto;
import com.summarai.summarai.model.Statistics;
import com.summarai.summarai.model.UserReading;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface StatisticsService {
    // void updateTotalReadingDays(Statistics statistics, List<LocalDate> readingDates);
    // void updateDayStreak(Statistics statistics,List<LocalDate>readingDates);
     StatisticsDto getStatistics();
     void updateStatistics();
     Long getTotalReadingSummaries();
     List<GenreCountDTO> getTotalNumberOfSummariesByGenre();
}
