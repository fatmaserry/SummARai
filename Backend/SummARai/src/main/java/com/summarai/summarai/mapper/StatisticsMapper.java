package com.summarai.summarai.mapper;

import com.summarai.summarai.dto.AuthorDto;
import com.summarai.summarai.dto.StatisticsDto;
import com.summarai.summarai.model.Author;
import com.summarai.summarai.model.Statistics;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StatisticsMapper {

    public StatisticsDto toDto(Statistics statistics);
    public Statistics toEntity(StatisticsDto statisticsDto);
    public List<StatisticsDto> toDtos(List<Statistics> statistics);
    public List<Statistics> toEntities(List<StatisticsDto> statisticsDtos);


}
