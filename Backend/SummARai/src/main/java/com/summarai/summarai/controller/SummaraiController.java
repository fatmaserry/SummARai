package com.summarai.summarai.controller;

import com.summarai.summarai.security.UserDetailsServiceImpl;
import com.summarai.summarai.service.impl.SummaraiServiceImpl;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.publisher.Mono;

import java.security.Principal;

@Controller
@RequestMapping("/summarai")
public class SummaraiController {
    private final SummaraiServiceImpl summaraiService;

    public SummaraiController(SummaraiServiceImpl summaraiService) {
        this.summaraiService = summaraiService;

    }

    @PostMapping(value = "/summarize" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void summarai(@RequestParam("file") MultipartFile file, @RequestParam String email,@RequestParam int is_public) {
        summaraiService.summarai(file,email,is_public, file.getOriginalFilename());

    }
    @GetMapping(value = "/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamEvents() {
        return summaraiService.createEmitter();
    }
}
