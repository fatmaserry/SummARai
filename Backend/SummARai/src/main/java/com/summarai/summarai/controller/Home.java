package com.summarai.summarai.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("")
public class Home {
    @GetMapping()
    String home() {
        return "Hello World\nWelcome To SummARai";
    }
}
