package com.summarai.summarai.service;

import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

public interface SummaraiService {
    public Mono<Long> summarai(MultipartFile book);
}
