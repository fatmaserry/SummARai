package com.summarai.summarai.repository;

import com.summarai.summarai.model.User;
import com.summarai.summarai.model.UserReading;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Boolean existsByEmail(String email);

}
