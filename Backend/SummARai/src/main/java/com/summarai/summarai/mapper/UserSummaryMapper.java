package com.summarai.summarai.mapper;

import com.summarai.summarai.dto.UserSummaryDto;
import com.summarai.summarai.model.UserSummary;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;


@Mapper(componentModel = "spring")

public interface UserSummaryMapper {
    @Mapping(source = "owner_id", target = "owner.id")
    UserSummary toEntity(UserSummaryDto userSummary) ;
    @Mapping(source = "owner.id", target = "owner_id")
    UserSummaryDto toDto(UserSummary userSummary) ;
    @Mapping(source = "owner_id", target = "owner.id")
    List<UserSummary> toEntities(List<UserSummaryDto> userSummaryDtoList);
    @Mapping(source = "owner.id", target = "owner_id")
    List<UserSummaryDto> toDtos(List<UserSummary> userSummaryList);
}
