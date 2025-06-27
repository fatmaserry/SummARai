package com.summarai.summarai.email;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;
@Component
public class Redis {
    private final StringRedisTemplate redisTemplate;

    public Redis(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void storeOtp(String email, String otp) {
        redisTemplate.opsForValue().set("otp:" + email, otp, 5, TimeUnit.MINUTES);
    }

    public boolean verifyOtp(String email, String otp) {
        String emailOTP = "otp:" + email;
        String storedOtp = redisTemplate.opsForValue().get(emailOTP);
        if(storedOtp.equals(otp)){
            redisTemplate.delete(emailOTP);
            return true;
        }
        return false;
    }

}
