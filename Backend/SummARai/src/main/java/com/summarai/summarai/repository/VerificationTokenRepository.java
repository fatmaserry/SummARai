package com.summarai.summarai.repository;

import com.summarai.summarai.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;
public interface VerificationTokenRepository extends JpaRepository<VerificationToken,Long> {
    // Find a token by its value
    Optional<VerificationToken> findByToken(String token);

    // Delete expired tokens (optional)
    void deleteByExpiryDateBefore(Instant now);
}
