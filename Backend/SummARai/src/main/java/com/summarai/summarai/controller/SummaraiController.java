package com.summarai.summarai.controller;

import com.summarai.summarai.security.UserDetailsServiceImpl;
import com.summarai.summarai.service.impl.SummaraiServiceImpl;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.security.Principal;

@Controller
@RequestMapping("/summarai")
public class SummaraiController {
    private final SummaraiServiceImpl summaraiService;
    private final UserDetailsServiceImpl userDetailsService;

    public SummaraiController(SummaraiServiceImpl summaraiService, UserDetailsServiceImpl userDetailsService) {
        this.summaraiService = summaraiService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping(value = "/summarize" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> summarai(@RequestParam("file") MultipartFile file, @RequestParam int is_public, @RequestParam String title) throws IOException {
        String email = userDetailsService.getCurrentUsername();
        summaraiService.summarai(file,email,title, is_public, file.getOriginalFilename());
        return ResponseEntity.status(HttpStatus.OK).build();
    }
    @GetMapping(value = "/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamEvents() {
        return summaraiService.createEmitter();
    }
}
