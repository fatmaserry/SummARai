package com.summarai.summarai.mapper;

import com.summarai.summarai.dto.UserSummaryDto;
import com.summarai.summarai.model.UserSummary;
import org.mapstruct.Mapper;
import java.util.List;


@Mapper(componentModel = "spring")

public interface UserSummaryMapper {
    UserSummary toEntity(UserSummaryDto userSummary) ;
    UserSummaryDto toDto(UserSummary userSummary) ;
    List<UserSummary> toEntities(List<UserSummaryDto> userSummaryDtoList);
    List<UserSummaryDto> toDtos(List<UserSummary> userSummaryList);


}
