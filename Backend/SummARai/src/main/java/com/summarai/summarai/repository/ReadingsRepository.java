package com.summarai.summarai.repository;

import com.summarai.summarai.model.User;
import com.summarai.summarai.model.UserReading;
import com.summarai.summarai.model.UserReadingId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReadingsRepository extends JpaRepository<UserReading, UserReadingId> {
    List<UserReading> findByUserId(Long id);

    Optional<LocalDate> findLastReadingDateByUser(User user);


}
