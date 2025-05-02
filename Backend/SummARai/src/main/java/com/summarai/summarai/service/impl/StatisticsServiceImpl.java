package com.summarai.summarai.service.impl;

import com.summarai.summarai.model.Statistics;
import com.summarai.summarai.model.User;
import com.summarai.summarai.model.UserReading;
import com.summarai.summarai.repository.ReadingsRepository;
import com.summarai.summarai.repository.StatisticsRepository;
import com.summarai.summarai.repository.UserRepository;
import com.summarai.summarai.service.StatisticsService;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

public class StatisticsServiceImpl implements StatisticsService {
    private final StatisticsRepository statisticsRepository;
    private final ReadingsRepository readingsRepository;
    private final UserRepository userRepository;
    private final DateTimeHelper dateTimeHelper;

    private final User user;

    public StatisticsServiceImpl(StatisticsRepository statisticsRepository, ReadingsRepository readingsRepository, UserRepository userRepository, DateTimeHelper dateTimeHelper, User user) {
        this.statisticsRepository = statisticsRepository;
        this.readingsRepository = readingsRepository;
        this.userRepository = userRepository;
        this.dateTimeHelper = dateTimeHelper;
        this.user=user;
    }

    public void updateStatistics(){
        Statistics statistics = user.getStatistics();
        List<UserReading> readings = readingsRepository.findByUserId(user.getId());
        List<LocalDate> readingDates = extractDates(readings);
        updateDayStreak(statistics,readingDates);
        updateTotalReadingDays(statistics, readingDates);
        statisticsRepository.save(statistics);
    }
    private List<LocalDate> extractDates(List<UserReading> readings) {
        return readings.stream()
                .map(reading -> {
                    return reading.getCreation_date()
                            .toInstant()                         // Convert Date to Instant
                            .atZone(ZoneId.systemDefault())      // Apply system time zone
                            .toLocalDate();                      // Extract date portion
                })
                .sorted()
                .toList();
    }

    @Override
    public void updateDayStreak(Statistics statistics,List<LocalDate>dates) {
        long currentStreak = 0;
        long mxStreak = 0;
        LocalDate previousDate = null;
        LocalDate today = LocalDate.now();

        for (LocalDate date : dates) {
            if (isConsecutiveDay(previousDate, date)) {
                currentStreak++;
            } else {
                currentStreak = 1;
            }

            mxStreak = Math.max(mxStreak, currentStreak);
            previousDate = date;
        }

        boolean todayRead = dates.contains(today);
        statistics.setDayStreak(todayRead ? currentStreak : 0);
        statistics.setMaxStreak(mxStreak);
    }
    private boolean isConsecutiveDay(LocalDate previous, LocalDate current) {
        return previous != null && previous.plusDays(1).equals(current);
    }
    @Override
    public void updateTotalReadingDays(Statistics statistics, List<LocalDate> dates) {
        long uniqueDays = dates.stream()
                .distinct()
                .count();

        statistics.setTotalReadingDays(uniqueDays);
    }
    // crontab pattern. this pattern creates a scheduled function call daily, monthly ,hourly or on specific hours and more
    @Scheduled(cron = "0 0 3 * * *") // Daily at 3 AM
    public void checkAndResetStreaks() {
        List<User> users = userRepository.findAllUsersWithStatistics();

        users.forEach(user -> {
            Optional<LocalDate> lastReadingDate = readingsRepository
                    .findLastReadingDateByUser(user);

            if (lastReadingDate.isEmpty() ||
                    !dateTimeHelper.isConsecutiveDay(lastReadingDate.get(), LocalDate.now())) {
                user.getStatistics().setDayStreak(0L);
                statisticsRepository.save(user.getStatistics());
            }
        });
    }
}
