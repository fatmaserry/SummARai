package com.summarai.summarai.service.search;

import com.summarai.summarai.dto.BookSearchRequest;
import com.summarai.summarai.mapper.UserSummaryMapper;
import com.summarai.summarai.model.UserSummary;
import com.summarai.summarai.repository.UserSummaryRepository;
import com.summarai.summarai.security.UserDetailsServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class UserGeneratedSearchFactory extends SearchFactory{
    private final UserSummaryRepository userSummaryRepository;
    private final UserSummaryMapper mapper;
    private final UserDetailsServiceImpl userDetailsService;

    public UserGeneratedSearchFactory(UserSummaryRepository userSummaryRepository, UserSummaryMapper mapper, UserDetailsServiceImpl userDetailsService) {
        this.userSummaryRepository = userSummaryRepository;
        this.mapper = mapper;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public Page<?> CreateSearch(BookSearchRequest bookSearchRequest, Pageable pageable) {

        this.criteria = new UserGeneratedSearchCriteria(userDetailsService);
        Specification<?> spec =criteria.search(bookSearchRequest);
        return userSummaryRepository.findAll((Specification<UserSummary>) spec,pageable).map(mapper::toDto);
    }

}
