package com.summarai.summarai.email;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Random;
@Service
public class OTPServiceImpl implements OTPService{
    private final EmailSender emailService;
    private final Redis redis;


    public OTPServiceImpl(EmailSender emailService, Redis redis) {
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
