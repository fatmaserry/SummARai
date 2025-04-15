package com.summarai.summarai.mapper;

import com.summarai.summarai.dto.UserReadingDto;
import com.summarai.summarai.model.UserReading;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")

public interface UserReadingMapper {
    public UserReadingDto toDto(UserReading userReading);
    public UserReading toEntity(UserReadingDto userReadingDto);
    public List<UserReadingDto> toDtos(List<UserReading> userReadings);
    public List<UserReading> toEntities(List<UserReadingDto> userReadingDto);
}
