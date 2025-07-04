package com.summarai.summarai.service;

import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.security.AuthenticationResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public interface AuthService {
    public AuthenticationResponse register(UserDto request) ;
    public AuthenticationResponse login(UserDto request) ;
    public void updatePassword(String email, String password);
    public boolean verifyOTP(String email, String otp);
    public void confirmToken(String token);
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException ;
}
