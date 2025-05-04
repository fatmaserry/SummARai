package com.summarai.summarai.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;


@Service
public class JwtService {
    @Value("${jwt.secret-key}")
    private String jwtSecretKey;

    @Value("${jwt.audience}")
    private String audience;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    @Value("${jwt.refresh.token.expiration}")
    private Long refreshExpiration;

    public String generateToken(UserDetails userDetails) {
        return buildToken(userDetails, jwtExpiration);
    }
    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(userDetails, refreshExpiration);
    }

    private String buildToken(UserDetails userDetails, Long expiration) {
        return Jwts.builder().setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + expiration))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }




    private Key key(){
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecretKey));
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try{
            Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            throw new JwtException("Invalid JWT token");
        }
    }


}
