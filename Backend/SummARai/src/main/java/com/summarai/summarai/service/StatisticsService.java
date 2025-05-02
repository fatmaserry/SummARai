package com.summarai.summarai.service;

import com.summarai.summarai.model.Statistics;
import com.summarai.summarai.model.UserReading;

import java.time.LocalDate;
import java.util.List;

public interface StatisticsService {
     void updateTotalReadingDays(Statistics statistics, List<LocalDate> readingDates);
     void updateDayStreak(Statistics statistics,List<LocalDate>readingDates);
}
