package com.summarai.summarai.controller;

import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.security.AuthenticationResponse;
import com.summarai.summarai.service.impl.AuthServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthServiceImpl authServiceImpl;

    public AuthController(AuthServiceImpl authServiceImpl) {
        this.authServiceImpl = authServiceImpl;
    }


    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody UserDto request
    )throws RuntimeException {
        return ResponseEntity.ok(authServiceImpl.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody UserDto request
    ) {
        return ResponseEntity.ok(authServiceImpl.login(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        authServiceImpl.refreshToken(request, response);
    }
}