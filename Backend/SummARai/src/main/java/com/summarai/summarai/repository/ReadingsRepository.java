package com.summarai.summarai.repository;

import com.summarai.summarai.model.UserReading;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReadingsRepository extends JpaRepository<UserReading,Long> {
    UserReading findByUserId(Long id);
}
