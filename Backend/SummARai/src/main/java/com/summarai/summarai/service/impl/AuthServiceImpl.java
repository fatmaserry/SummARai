package com.summarai.summarai.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.email.*;
import com.summarai.summarai.mapper.UserMapper;
import com.summarai.summarai.model.Statistics;
import com.summarai.summarai.model.Token;
import com.summarai.summarai.model.User;
import com.summarai.summarai.model.VerificationToken;
import com.summarai.summarai.repository.TokenRepository;
import com.summarai.summarai.repository.UserRepository;
import com.summarai.summarai.repository.VerificationTokenRepository;
import com.summarai.summarai.security.AuthenticationResponse;
import com.summarai.summarai.security.JwtService;
import com.summarai.summarai.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final TokenRepository tokenRepository;
    private final EmailSender emailService;
    private final VerificationTokenRepository verificationTokenRepository;
    private final UserRepository userRepository;
    private final OTPService otpService;


    public AuthServiceImpl(UserRepository repository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager, UserMapper userMapper, TokenRepository tokenRepository, EmailSender emailService, VerificationTokenRepository verificationTokenRepository, UserRepository userRepository, OTPService otpService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userMapper = userMapper;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.verificationTokenRepository = verificationTokenRepository;
        this.userRepository = userRepository;
        this.otpService = otpService;
    }

    public AuthenticationResponse register(UserDto request) {
        String email = request.getEmail();
        System.out.println(email);

        if (repository.existsByEmail(request.getEmail())) {
            return AuthenticationResponse.builder()
                    .status(409) // Conflict: Email already exists
                    .accessToken(null)
                    .refreshToken(null)
                    .message("Email already exists")
                    .build();
        }

        User user = userMapper.toEntity(request);
        user.setEnabled(false);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatistics(new Statistics());
        var savedUser = repository.save(user);

        String verificationToken = UUID.randomUUID().toString();
        saveVerificationToken(savedUser, verificationToken);

        String confirmationLink = "http://localhost:8080/api/auth/confirm?token=" + verificationToken;
        String subject = "Confirm your email";
        String emailText = buildVerifyEmail(user.getName(), confirmationLink);
        emailService.send(request.getEmail(), subject, emailText);

        var jwtToken = jwtService.generateToken(savedUser);
        var refreshToken = jwtService.generateRefreshToken(savedUser);
        saveUserToken(savedUser, jwtToken);

        return AuthenticationResponse.builder()
                .status(200) // Created: Registration successful
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .message("Registration successful. Please verify your email.")
                .build();
    }

    public boolean forgetPassword(String email){
        boolean found = userRepository.existsByEmail(email);
        if(!found)
            return false;
        String subject = "Verify your identity";
        String otp = otpService.generateOTP();
        String emailText = buildOTPEmail(email,otp);
        otpService.sendOTP(email,subject,emailText);
        otpService.storeOtp(email,otp);
        return true;
    }
    public boolean verifyOTP(String email, String otp){
        return otpService.verifyOtp(email,otp);
    }
    public void updatePassword(String email, String password){
        // the user is already verified
        User user = userRepository.findByEmail(email).get();
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }
    private void saveVerificationToken(User user, String token) {
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiryDate(Instant.now().plus(15, ChronoUnit.MINUTES));
        verificationTokenRepository.save(verificationToken);
    }

    public void confirmToken(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (verificationToken.getExpiryDate().isBefore(Instant.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = verificationToken.getUser();
        user.setEnabled(true);

        var savedUser = repository.save(user);

        var jwtToken = jwtService.generateToken(savedUser);
        var refreshToken = jwtService.generateRefreshToken(savedUser);
        revokeAllUserTokens(user);
        saveUserToken(savedUser, jwtToken);

        verificationTokenRepository.delete(verificationToken);
    }
    public AuthenticationResponse login(UserDto request) {
        AuthenticationResponse.AuthenticationResponseBuilder responseBuilder = AuthenticationResponse.builder();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            var userOpt = repository.findByEmail(request.getEmail());
            if (userOpt.isEmpty()) {
                return responseBuilder
                        .status(404)
                        .message("User not found.")
                        .build();
            }
            var user = userOpt.get();
            if (!user.isEnabled()) {
                String verificationToken = UUID.randomUUID().toString();
                saveVerificationToken(user, verificationToken);
                String confirmationLink = "http://localhost:8080/api/auth/confirm?token=" + verificationToken;
                String subject = "Confirm your email";
                String emailText = buildVerifyEmail(user.getName(), confirmationLink);
                emailService.send(request.getEmail(), subject, emailText);

                return responseBuilder
                        .status(403)
                        .message("Account not verified. Please check your email.")
                        .build();
            }
            UserDto retUser = userMapper.toDto(user);
            var jwtToken = jwtService.generateToken(user);
            var refreshToken = jwtService.generateRefreshToken(user);
            revokeAllUserTokens(user);
            saveUserToken(user, jwtToken);
            return responseBuilder
                    .status(200)
                    .message("Login successful.")
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .user(retUser)
                    .build();
        } catch (AuthenticationException ex) {
            return responseBuilder
                    .status(401)
                    .message("Authentication failed: " + ex.getMessage())
                    .build();
        }
    }


    private void saveUserToken(com.summarai.summarai.model.User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(com.summarai.summarai.model.User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.getUsernameFromToken(refreshToken);
        if (userEmail != null) {
            var user = this.repository.findByEmail(userEmail)
                    .orElseThrow();
            if (jwtService.validateToken(refreshToken)) {

                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    public String buildVerifyEmail(String name, String link) {
        return """
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>تأكيد البريد الإلكتروني</title>
        <style>
            body {
                font-family: 'Cairo', Arial, sans-serif;
                background-color: #F4F6F9;
                margin: 0;
                padding: 0;
                direction: rtl;
            }
            .container {
                background-color: #ffffff;
                max-width: 600px;
                margin: 40px auto;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(42, 28, 99, 0.12);
                border: 2px solid #C084FC;
            }
            .logo {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo img {
                max-width: 120px;
            }
            .greeting {
                font-size: 22px;
                font-weight: bold;
                color: #2A1C63;
                margin-bottom: 20px;
                letter-spacing: 1px;
            }
            .message {
                font-size: 16px;
                color: #471C53;
                margin-bottom: 20px;
                line-height: 1.7;
            }
            .verify-btn {
                display: inline-block;
                background: linear-gradient(90deg, #C084FC 0%%, #765CDE 100%%);
                color: #fff;
                padding: 15px 40px;
                text-decoration: none;
                font-size: 18px;
                border-radius: 8px;
                margin: 20px 0;
                font-weight: bold;
                box-shadow: 0 2px 8px rgba(118, 92, 222, 0.10);
                transition: background 0.2s;
            }
            .verify-btn:hover {
                background: linear-gradient(90deg, #765CDE 0%%, #C084FC 100%%);
            }
            .footer {
                font-size: 13px;
                color: #888888;
                text-align: center;
                margin-top: 30px;
                border-top: 1px solid #E0E0E0;
                padding-top: 10px;
            }
        </style>
    </head>
    <body>
    <div class="container">
        <div class="greeting">تأكيد البريد الإلكتروني</div>
        <div class="message">
            مرحباً <strong>%s</strong>،
            <br><br>
            نشكرك على التسجيل في منصتنا.<br>
            يرجى الضغط على الزر أدناه لتفعيل بريدك الإلكتروني
        </div>
        <div style="text-align: center;">
            <a href="%s" class="verify-btn">تفعيل البريد الإلكتروني</a>
        </div>
        <div class="message" style="color:#3E1E6C;">
            هذا الرابط صالح لمدة 15 دقيقة فقط.<br>
            إذا لم تطلب هذا البريد، يمكنك تجاهله بأمان.
        </div>
        <div class="footer">
            &copy; 2025 فريق SummARai. جميع الحقوق محفوظة.
        </div>
    </div>
    </body>
    </html>
    """.formatted(name, link);
    }


    public String buildOTPEmail(String email, String otp) {
        return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Email Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f6f9;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    background-color: #ffffff;
                    max-width: 600px;
                    margin: 40px auto;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }
                .logo {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .logo img {
                    max-width: 150px;
                }
                .greeting {
                    font-size: 20px;
                    font-weight: bold;
                    color: #333333;
                    margin-bottom: 20px;
                }
                .message {
                    font-size: 16px;
                    color: #555555;
                    margin-bottom: 20px;
                }
                .otp-box {
                    font-size: 28px;
                    letter-spacing: 6px;
                    font-weight: bold;
                    color: #1a73e8;
                    background-color: #e9f0fb;
                    padding: 15px;
                    text-align: center;
                    border-radius: 6px;
                    margin-bottom: 30px;
                }
                .footer {
                    font-size: 12px;
                    color: #888888;
                    text-align: center;
                }
            </style>
        </head>
        <body>

        <div class="container">
            <div class="logo">
                <img src="Backend/SummARai/images/SummARai_website.png" alt="GP Logo">
            </div>

            <div class="greeting">Verify Your Email Address</div>

            <div class="message">
                Hello <strong>%s</strong>,<br><br>
                Please use the following One-Time Password (OTP) to verify your email address:
            </div>

            <div class="otp-box">%s</div>

            <div class="message">
                This OTP is valid for a limited time. If you didn’t request this, you can safely ignore this email.
            </div>

            <div class="footer">
                &copy; 2025 GP Team. All rights reserved.
            </div>
        </div>

        </body>
        </html>
        """.formatted(email, otp);
    }

}