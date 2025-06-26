package com.summarai.summarai.email;

import java.util.concurrent.CompletableFuture;

public interface EmailSender {
    void send(String to, String subject, String emailText);
}
