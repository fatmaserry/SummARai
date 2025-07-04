package com.summarai.summarai.service;
import com.summarai.summarai.dto.GenreCountDTO;
import com.summarai.summarai.dto.StatisticsDto;
import java.util.List;

public interface StatisticsService {

     StatisticsDto getStatistics();
     void updateStatistics();
     Long getTotalReadingSummaries();
     List<GenreCountDTO> getTotalNumberOfSummariesByGenre();
}
