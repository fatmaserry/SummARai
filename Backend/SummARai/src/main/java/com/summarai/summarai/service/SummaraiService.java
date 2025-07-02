package com.summarai.summarai.service;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.publisher.Mono;

import java.io.IOException;

public interface SummaraiService {
    public void summarai(MultipartFile book, String email, int is_public,String summaryName)  throws IOException;
    public SseEmitter createEmitter();
}
