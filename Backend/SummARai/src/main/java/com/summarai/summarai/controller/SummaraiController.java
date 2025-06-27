package com.summarai.summarai.controller;

import com.summarai.summarai.service.impl.SummaraiServiceImpl;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Controller
@RequestMapping("/summarai")
public class SummaraiController {
    private final SummaraiServiceImpl summaraiService;

    public SummaraiController(SummaraiServiceImpl summaraiService) {
        this.summaraiService = summaraiService;
    }

    @PostMapping(value = "/summarize" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE) // from fastapi save the summary in db and return the id
    public Mono<String> summarai(@RequestParam("file") MultipartFile file) {
        return summaraiService.summarai(file);

    }
    @GetMapping(value = "/progress/{taskId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamProgress(@PathVariable String taskId) {
        // Step 2: Stream progress updates for the task
        return summaraiService.streamSummaryProgress(taskId); // returns Flux<String>
    }
}
