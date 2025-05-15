package com.summarai.summarai.controller;

import com.summarai.summarai.dto.StatisticsDto;
import com.summarai.summarai.security.UserDetailsServiceImpl;
import com.summarai.summarai.service.StatisticsService;
import com.summarai.summarai.service.impl.StatisticsServiceImpl;
import io.swagger.models.auth.In;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {
    private final StatisticsServiceImpl statisticsService;
    public StatisticsController(StatisticsServiceImpl statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("")
    public ResponseEntity<StatisticsDto> getUserStatistics() {
        StatisticsDto statistics = statisticsService.getStatistics();
        return ResponseEntity.ok(statistics);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUserStatistics() {
        statisticsService.updateStatistics();
        return ResponseEntity.ok().build();
    }


    @GetMapping("/summary")
    public ResponseEntity<Long> getTotalNumberOfSummaries() {
        return ResponseEntity.ok(statisticsService.getTotalReadingSummaries());
    }

    @GetMapping("/summary/{genre}")
    public ResponseEntity<Long> getTotalNumberOfSummariesByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(statisticsService.getTotalNumberOfSummariesByGenre(genre));
    }

}
