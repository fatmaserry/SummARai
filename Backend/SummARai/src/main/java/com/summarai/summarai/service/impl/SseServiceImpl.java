package com.summarai.summarai.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class SseServiceImpl {
    private final ConcurrentHashMap<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public void registerEmitter(String email, SseEmitter emitter) {
        emitters.put(email, emitter);
    }

    public SseEmitter getEmitter(String email) {
        return emitters.get(email);
    }

    public void removeEmitter(String email) {
        emitters.remove(email);
    }
}
