package com.summarai.summarai.email;

import org.springframework.data.redis.core.StringRedisTemplate;

import java.util.concurrent.TimeUnit;

public class Redis {
    private final StringRedisTemplate redisTemplate;

    public Redis(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void storeOtp(String email, String otp) {
        redisTemplate.opsForValue().set("otp:" + email, otp, 5, TimeUnit.MINUTES);
    }

    public boolean verifyOtp(String email, String otp) {
        String storedOtp = redisTemplate.opsForValue().get("otp:" + email);
        return otp.equals(storedOtp);
    }
}
