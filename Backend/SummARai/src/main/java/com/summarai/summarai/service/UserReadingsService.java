package com.summarai.summarai.service;

import com.summarai.summarai.dto.UserReadingDto;
import com.summarai.summarai.exception.DuplicateRecordException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserReadingsService {

    UserReadingDto getReading(Long summary_id);
    Page<UserReadingDto> getReadings(Pageable pageable) ;
    Page<UserReadingDto> getFinishedReadings( Pageable pageable);
    UserReadingDto addReading(Long summar_id) throws DuplicateRecordException;
    UserReadingDto updateBookMark(Long summary_id, Long book_mark) ;
    UserReadingDto finishReading(Long summary_id);
}