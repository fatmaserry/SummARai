package com.summarai.summarai.service;

import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

public interface SummaraiService {
    public Mono<String> summarai(MultipartFile book);
}
