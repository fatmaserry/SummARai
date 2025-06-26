package com.summarai.summarai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SummARaiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SummARaiApplication.class, args);
    }

}
