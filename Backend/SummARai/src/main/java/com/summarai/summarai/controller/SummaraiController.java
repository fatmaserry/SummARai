package com.summarai.summarai.controller;

import com.summarai.summarai.service.impl.SummaraiServiceImpl;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

@Controller
@RequestMapping("/summarai")
public class SummaraiController {
    private final SummaraiServiceImpl summaraiService;

    public SummaraiController(SummaraiServiceImpl summaraiService) {
        this.summaraiService = summaraiService;
    }

    @PostMapping("/summarize") // from fastapi save the summary in db and return the id
    public Mono<Long> summarai(@RequestParam("file") MultipartFile file) {
        return summaraiService.summarai(file);

    }
}
