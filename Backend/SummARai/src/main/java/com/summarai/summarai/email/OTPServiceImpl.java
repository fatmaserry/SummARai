package com.summarai.summarai.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.CompletableFuture;
@Service
public class OTPServiceImpl implements OTPService{
    private final EmailService emailService;
    private final Redis redis;


    public OTPServiceImpl(EmailService emailService, Redis redis) {
        this.emailService = emailService;
        this.redis = redis;
    }

    @Override
    public String generateOTP() {
        Random random = new Random();
        int otpVal = 100_000 + random.nextInt(900_000);
        return String.valueOf(otpVal);
    }

    @Override
    @Async
    public void sendOTP(String to,String subject, String emailText) {
        emailService.send(to,subject,emailText);
    }

    @Override
    public void storeOtp(String email, String otp) {
        redis.storeOtp(email,otp);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        return redis.verifyOtp(email, otp);
    }

}
