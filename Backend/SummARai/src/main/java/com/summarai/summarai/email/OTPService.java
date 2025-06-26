package com.summarai.summarai.email;

import java.util.concurrent.CompletableFuture;

public interface OTPService {
    public String generateOTP();
    public void sendOTP(String to,String subject, String emailText);
    public void storeOtp(String email, String otp);
    public boolean verifyOtp(String email, String otp);
//    public boolean validateOTP(String accountNumber, String otp);
}
