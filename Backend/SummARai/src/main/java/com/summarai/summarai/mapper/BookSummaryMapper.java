package com.summarai.summarai.mapper;

import com.summarai.summarai.dto.BookSummaryDto;
import com.summarai.summarai.model.BookSummary;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")

public interface BookSummaryMapper {
    public BookSummaryDto toDto(BookSummary bookSummary);
    public BookSummary toEntity(BookSummaryDto bookSummaryDto);
    public List<BookSummaryDto> toDtos(List<BookSummary> bookSummaries);
    public List<BookSummary> toEntities(List<BookSummaryDto> bookSummaryDto);
}
