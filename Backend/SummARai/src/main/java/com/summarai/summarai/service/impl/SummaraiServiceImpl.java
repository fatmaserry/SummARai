package com.summarai.summarai.service.impl;

import com.summarai.summarai.model.UserSummary;
import com.summarai.summarai.security.UserDetailsServiceImpl;
import com.summarai.summarai.service.SummaraiService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Service
public class SummaraiServiceImpl implements SummaraiService {

    private final WebClient webClient;
    private final SseServiceImpl sseService;
    private final UserDetailsServiceImpl userDetailsService;
    private final S3ServiceImpl s3Service;
    public SummaraiServiceImpl(WebClient.Builder webClientBuilder, SseServiceImpl sseService, UserDetailsServiceImpl userDetailsService, S3ServiceImpl s3Service) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:8000").build();
        this.sseService = sseService;
        this.userDetailsService = userDetailsService;
        this.s3Service = s3Service;
    }

    @Override
    public void summarai(MultipartFile book, String email, int is_public,String summaryName) {
        webClient.post()
                .uri("/getSummary")
                .body(BodyInserters.fromMultipartData("book", book.getResource()))
                .retrieve()
                .bodyToMono(Void.class)
                .subscribe();

        webClient.get()
                .uri("/stream")
                .accept(MediaType.TEXT_EVENT_STREAM)
                .retrieve()
                .bodyToFlux(String.class)
                .doOnNext(event -> {
                    SseEmitter emitter = sseService.getEmitter(email);
                    if (emitter != null) {
                        try {
                            emitter.send(SseEmitter.event().data(event));
                        } catch (IOException e) {
                            emitter.completeWithError(e);
                        }
                    }

                    if ("end".equalsIgnoreCase(event.trim())) {
                        saveSummary(email, is_public,summaryName);
                    }
                })
                .doOnError(Throwable::printStackTrace)
                .subscribe();
    }
    public SseEmitter createEmitter(){
        // get userid somehow
        SseEmitter emitter = new SseEmitter();
        String email = userDetailsService.getCurrentUsername();
        sseService.registerEmitter(email, emitter);

        emitter.onCompletion(() -> sseService.removeEmitter(email));
        emitter.onTimeout(() -> sseService.removeEmitter(email));
        emitter.onError(e -> sseService.removeEmitter(email));

        return emitter;
    }

    private void saveSummary(String email, int is_public,String summaryName) {
        webClient.get()
                .uri("/download")
                .accept(MediaType.APPLICATION_PDF)
                .retrieve()
                .bodyToMono(byte[].class)
                .doOnNext(pdfBytes -> {

                    UserSummary userSummary = new UserSummary();
                    String fileName = s3Service.uploadFile(pdfBytes, summaryName + ".pdf");
                    userSummary.setSummary_url(fileName);
                    userSummary.setIs_public(is_public == 1);
                    userSummary.setTitle(summaryName);

                    SseEmitter emitter = sseService.getEmitter(email);
                    if (emitter != null) {
                        try {
                            emitter.send(SseEmitter.event().data("done"));
                            emitter.complete();
                            sseService.removeEmitter(email);
                        } catch (IOException e) {
                            emitter.completeWithError(e);
                        }
                    }

                })
                .doOnError(Throwable::printStackTrace)
                .subscribe();
    }
}

