package com.summarai.summarai.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.email.EmailSender;
import com.summarai.summarai.email.EmailService;
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


    public AuthServiceImpl(UserRepository repository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager, UserMapper userMapper, TokenRepository tokenRepository,  EmailService emailService, VerificationTokenRepository verificationTokenRepository) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userMapper = userMapper;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.verificationTokenRepository = verificationTokenRepository;
    }

    public AuthenticationResponse register(UserDto request) {
        String email = request.getEmail();
        System.out.println(email);
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }


        User user = userMapper.toEntity(request);
        user.setEnabled(false);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatistics(new Statistics());
        var savedUser = repository.save(user);

        String verificationToken = UUID.randomUUID().toString();
        saveVerificationToken(savedUser, verificationToken);

        // remember to remove user if not verified email
        String confirmationLink = "http://localhost:8080/api/auth/confirm?token=" + verificationToken;
        emailService.send(request.getEmail(), buildEmail(user.getName(), confirmationLink));

//        var userDetails = userDetailsMapper.userToUserDetails(savedUser);
        var jwtToken = jwtService.generateToken(savedUser);
        var refreshToken = jwtService.generateRefreshToken(savedUser);
        saveUserToken(savedUser, jwtToken);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public String buildEmail(String name, String link) {
        return """
        <div style="font-family: Arial, sans-serif;">
            <h2>Email Confirmation</h2>
            <p>Hi %s,</p>
            <p>Please click the button below to verify your email:</p>
            <a href="%s" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none;">
                Verify Email
            </a>
            <p>This link will expire in 15 minutes.</p>
        </div>
        """.formatted(name, link);
    }

    private void saveVerificationToken(User user, String token) {
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiryDate(Instant.now().plus(15, ChronoUnit.MINUTES));
        verificationTokenRepository.save(verificationToken); // Save to DB
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
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            var user = repository.findByEmail(request.getEmail())
                    .orElseThrow();
            if(!user.isEnabled()){
                throw new RuntimeException("Account not verified. Please check your email.");
            }
            UserDto retUser = userMapper.toDto(user);
            var jwtToken = jwtService.generateToken(user);
            var refreshToken = jwtService.generateRefreshToken(user);
            revokeAllUserTokens(user);
            saveUserToken(user, jwtToken);
            return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .user(retUser)
                    .build();
        } catch (AuthenticationException ex) {
            ex.printStackTrace();
            throw new RuntimeException("Authentication failed: " + ex.getMessage());
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
}