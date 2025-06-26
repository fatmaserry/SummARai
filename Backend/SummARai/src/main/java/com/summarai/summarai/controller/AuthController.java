package com.summarai.summarai.controller;

import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.security.AuthenticationResponse;
import com.summarai.summarai.service.BookSummaryService;
import com.summarai.summarai.service.impl.AuthServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
//        bookSummaryService.normalizeExistingBooks();
        //check if throws exception
        return ResponseEntity.ok(authServiceImpl.login(request));
    }
    @PostMapping("/forget-password")
    public ResponseEntity<?> forgetPassword (@RequestBody String email){
        if(authServiceImpl.forgetPassword(email))
            return ResponseEntity.ok().build();
        return ResponseEntity.ok(HttpStatus.NOT_FOUND);
    }
    @PostMapping("/verifyOTP")
    public ResponseEntity<?>verifyOTP(@RequestBody String email, @RequestBody String otp){
        if(authServiceImpl.verifyOTP(email, otp))
            return ResponseEntity.ok().build();
        return ResponseEntity.ok(HttpStatus.BAD_REQUEST);
    }
    @PostMapping("/update-password")
    public ResponseEntity<?>updatePassword(@RequestBody String email,@RequestBody String password){
        authServiceImpl.updatePassword(email,password);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        authServiceImpl.refreshToken(request, response);
    }
    @GetMapping("/confirm")
    public ResponseEntity<String> confirm(@RequestParam("token") String token) {
        authServiceImpl.confirmToken(token);
        return ResponseEntity.ok("Email confirmed successfully!");
    }
}