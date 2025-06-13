package com.summarai.summarai.mapper;

import com.summarai.summarai.dto.UserReadingDto;
import com.summarai.summarai.model.UserReading;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring",
        uses = { SummaryMapper.class })
public interface UserReadingMapper {

    @Mapping(source = "summaryDto", target = "summary")
    UserReading toEntity(UserReadingDto dto);

    @Mapping(source = "summary",   target = "summaryDto")
    UserReadingDto toDto(UserReading entity);

    // if you map lists:
    List<UserReading> toEntities(List<UserReadingDto> dtos);
    List<UserReadingDto> toDtos(List<UserReading> entities);
}