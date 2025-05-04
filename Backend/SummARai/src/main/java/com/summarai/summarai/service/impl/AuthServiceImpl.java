package com.summarai.summarai.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.mapper.UserDetailsMapper;
import com.summarai.summarai.mapper.UserMapper;
import com.summarai.summarai.model.Token;
import com.summarai.summarai.model.User;
import com.summarai.summarai.repository.TokenRepository;
import com.summarai.summarai.repository.UserRepository;
import com.summarai.summarai.security.AuthenticationResponse;
import com.summarai.summarai.security.JwtService;
import com.summarai.summarai.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final TokenRepository tokenRepository;
    private final UserDetailsMapper userDetailsMapper;


    public AuthServiceImpl(UserRepository repository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager, UserMapper userMapper, TokenRepository tokenRepository, UserDetailsMapper userDetailsMapper) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userMapper = userMapper;
        this.tokenRepository = tokenRepository;
        this.userDetailsMapper = userDetailsMapper;
    }

    public AuthenticationResponse register(UserDto request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        var savedUser = repository.save(user);

        var userDetails = userDetailsMapper.userToUserDetails(savedUser);
        var jwtToken = jwtService.generateToken(userDetails);
        var refreshToken = jwtService.generateRefreshToken(userDetails);
        saveUserToken(savedUser, jwtToken);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
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
            var jwtToken = jwtService.generateToken(userDetailsMapper.userToUserDetails(user));
            var refreshToken = jwtService.generateRefreshToken(userDetailsMapper.userToUserDetails(user));
            revokeAllUserTokens(user);
            saveUserToken(user, jwtToken);
            return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
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

                var accessToken = jwtService.generateToken(userDetailsMapper.userToUserDetails(user));
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