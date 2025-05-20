package com.summarai.summarai.service.impl;

import com.summarai.summarai.dto.UserReadingDto;
import com.summarai.summarai.exception.DuplicateRecordException;
import com.summarai.summarai.exception.ReadingNotFoundException;
import com.summarai.summarai.exception.SummaryNotFoundException;
import com.summarai.summarai.mapper.UserMapper;
import com.summarai.summarai.mapper.UserReadingMapper;
import com.summarai.summarai.model.Summary;
import com.summarai.summarai.model.UserReading;
import com.summarai.summarai.model.UserReadingId;
import com.summarai.summarai.repository.ReadingsRepository;
import com.summarai.summarai.repository.SummaryRepository;
import com.summarai.summarai.security.UserDetailsServiceImpl;
import com.summarai.summarai.service.UserReadingsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.sql.Date;
import java.time.LocalDate;

@Service
public class UserReadingsServiceImpl implements UserReadingsService {

    private final ReadingsRepository readingsRepository;
    private final UserDetailsServiceImpl userDetailsService;
    private final UserReadingMapper userReadingMapper;
    private final SummaryRepository summaryRepository;
    private final UserMapper userMapper;
    public UserReadingsServiceImpl(ReadingsRepository readingsRepository, UserDetailsServiceImpl userDetailsService, UserReadingMapper userReadingMapper, SummaryRepository summaryRepository, UserMapper userMapper) {
        this.readingsRepository = readingsRepository;
        this.userDetailsService = userDetailsService;
        this.userReadingMapper = userReadingMapper;
        this.summaryRepository = summaryRepository;
        this.userMapper = userMapper;
    }

    @Override
    public UserReadingDto getReading(Long summary_id) {
        Long user_id = userDetailsService.getCurrentUser().getId();
        UserReadingId userReadingId = new UserReadingId(user_id, summary_id);

        UserReading userReading = readingsRepository.findById(userReadingId)
                .orElseThrow(() ->  new ReadingNotFoundException( "Reading not found"));
        return userReadingMapper.toDto(userReading) ;
    }

    @Override
    public Page<UserReadingDto> getReadings( Pageable pageable) {
        Long user_id = userDetailsService.getCurrentUser().getId();
        return readingsRepository.getUserReadings(user_id, pageable)
                .map(userReadingMapper::toDto);
    }

    @Override
    public Page<UserReadingDto> getFinishedReadings(Pageable pageable) {
        Long user_id = userDetailsService.getCurrentUser().getId();
        return readingsRepository.getUserFinishedReadings(user_id, pageable)
                .map(userReadingMapper::toDto);
    }

    @Override
    public UserReadingDto addReading(Long summary_id) {
        Long user_id = userDetailsService.getCurrentUser().getId();
        UserReadingId userReadingId = new UserReadingId(user_id, summary_id);

        if(readingsRepository.existsById(userReadingId))
            throw new DuplicateRecordException("Reading already exists for this user and summary.");

        Summary summary = summaryRepository.findById(summary_id)
                .orElseThrow(() -> new SummaryNotFoundException("Summary not found, Couldn't Add the Reading"));

        Date curTime = Date.valueOf(LocalDate.now());
        UserReading userReading = new UserReading();
        userReading.setId(userReadingId);
        userReading.setSummary(summary);
        userReading.setCreation_date(curTime);
        userReading.setFinished(false);
        userReading.setUser(userMapper.toEntity(userDetailsService.getCurrentUser()));
        readingsRepository.save(userReading);
        var ret = userReadingMapper.toDto(userReading);
        ret.getSummaryDto().setSummary_url(null);
        return ret;
    }
    public UserReadingDto updateBookMark(Long summary_id, Long book_mark){
        Long user_id = userDetailsService.getCurrentUser().getId();
        UserReadingId userReadingId = new UserReadingId(user_id, summary_id);
        Summary summary = summaryRepository.findById(summary_id)
                .orElseThrow(() ->  new ReadingNotFoundException("Reading not found"));

        UserReading userReading = readingsRepository.findById(userReadingId)
                .orElseThrow(() ->  new ReadingNotFoundException("Reading not found"));
        if (book_mark > summary.getNumber_of_pages())
            new ReadingNotFoundException("Invalid Bookmark");

        userReading.setBook_mark(book_mark);

        UserReading updated = readingsRepository.save(userReading); // persist the update
        return userReadingMapper.toDto(updated);
    }
    @Override
    public UserReadingDto finishReading(Long summary_id) {
        Long user_id = userDetailsService.getCurrentUser().getId();
        UserReadingId userReadingId = new UserReadingId(user_id, summary_id);

        UserReading userReading = readingsRepository.findById(userReadingId)
                .orElseThrow(() ->new ReadingNotFoundException("Reading not found"));

        userReading.setFinished(true);

        UserReading updated = readingsRepository.save(userReading); // persist the update
        return userReadingMapper.toDto(updated);
    }



}
