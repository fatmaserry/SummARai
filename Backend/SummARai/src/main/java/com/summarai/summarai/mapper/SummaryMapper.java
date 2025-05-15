package com.summarai.summarai.mapper;

import com.summarai.summarai.dto.BookSummaryDto;
import com.summarai.summarai.dto.SummaryDto;
import com.summarai.summarai.dto.UserSummaryDto;
import com.summarai.summarai.model.BookSummary;
import com.summarai.summarai.model.Summary;
import com.summarai.summarai.model.UserSummary;
import org.mapstruct.Mapper;
import org.mapstruct.SubclassMapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring", uses = {BookSummaryMapper.class, UserSummaryMapper.class})
public abstract class SummaryMapper {

    // Declare abstract methods to access the mappers
    @Autowired
    BookSummaryMapper bookSummaryMapper ;
    @Autowired
    UserSummaryMapper summaryMapper;

    public SummaryDto toDto(Summary summary) {
        if (summary instanceof BookSummary) {
            return bookSummaryMapper.toDto((BookSummary) summary);
        } else if (summary instanceof UserSummary) {
            return summaryMapper.toDto((UserSummary) summary);
        }
        throw new IllegalArgumentException("Unsupported Summary type: " + summary.getClass().getName());
    }

    public Summary toEntity(SummaryDto dto) {
        if (dto instanceof BookSummaryDto) {
            return bookSummaryMapper.toEntity((BookSummaryDto) dto);
        } else if (dto instanceof UserSummaryDto) {
            return summaryMapper.toEntity((UserSummaryDto) dto);
        }
        throw new IllegalArgumentException("Unsupported DTO type: " + dto.getClass().getName());
    }

    // MapStruct handles lists automatically
    public abstract List<SummaryDto> toDtos(List<Summary> summaries);
    public abstract List<Summary> toEntities(List<SummaryDto> dtos);
}