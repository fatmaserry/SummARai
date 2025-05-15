package com.summarai.summarai.repository;

import com.summarai.summarai.model.User;
import com.summarai.summarai.model.UserReading;
import com.summarai.summarai.model.UserReadingId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReadingsRepository extends JpaRepository<UserReading, UserReadingId> {
    List<UserReading> findByUserId(Long id);

    Optional<LocalDate> findLastReadingDateByUser(User user);

    @Query("select count(u) from UserReading u where u.id.user_id = :userId and u.finished = :finished")
    Long countByUserIdAndFinished(Long userId, boolean finished);

    @Query("SELECT COUNT(ur) " +
            "FROM UserReading ur " +
            "JOIN BookSummary bs ON ur.summary = bs " +
            "JOIN bs.genres g " +
            "WHERE ur.id.user_id = :userId " +
            "AND ur.finished = true " +
            "AND g.description = :genreName")
    long countByUserIdAndGenreName(@Param("userId") Long userId, @Param("genreName") String genreName);
}
