package com.summarai.summarai.service.impl;

import com.summarai.summarai.service.SummaraiService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
public class SummaraiServiceImpl implements SummaraiService {
//    private final S3ServiceImpl s3Service;
    private final WebClient webClient;

    public SummaraiServiceImpl(S3ServiceImpl s3Service,WebClient webClient) {
//        this.s3Service = s3Service;
        this.webClient = webClient;
    }


    @Override
    public Mono<Long> summarai(MultipartFile book) {
        return Mono.fromCallable(() -> {
            ByteArrayResource resource = new ByteArrayResource(book.getBytes()) {
                @Override
                public String getFilename() {
                    return book.getOriginalFilename();
                }
            };

            MultipartBodyBuilder builder = new MultipartBodyBuilder();
            builder.part("file", resource)
                    .header("Content-Disposition", "form-data; name=file; filename=" + book.getOriginalFilename())
                    .contentType(MediaType.APPLICATION_PDF);

            return builder.build();
        }).flatMap(parts ->
                webClient.post()
                        .uri("/getSummary")
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .body(BodyInserters.fromMultipartData(parts))
                        .retrieve()
                        .bodyToMono(Long.class)
                        .timeout(Duration.ofMinutes(10))
        );
    }


}
