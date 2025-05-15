package com.summarai.summarai.repository;

import com.summarai.summarai.model.User;
import com.summarai.summarai.model.UserReading;
import com.summarai.summarai.model.UserReadingId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    //@Query("select s.summary_url from BookSummary s where s.id=:id")

    Optional<LocalDate> findLastReadingDateByUser(User user);


    @Query("select count(u) from UserReading u where u.id.user_id = :userId and u.finished = :finished")
    Long countByUserIdAndFinished(Long userId, boolean finished);
    @Query("select r from UserReading r where r.user.id = :user_id and r.finished = false ")
    Page<UserReading> getUserReadings(@Param("user_id") long user_id, Pageable pageable);

    @Query("select r from UserReading r where r.user.id = :user_id and r.finished = true ")
    Page<UserReading> getUserFinishedReadings(@Param("user_id") long user_id, Pageable pageable);


    @Query("SELECT COUNT(ur) " +
            "FROM UserReading ur " +
            "JOIN BookSummary bs ON ur.summary = bs " +
            "JOIN bs.genres g " +
            "WHERE ur.id.user_id = :userId " +
            "AND ur.finished = true " +
            "AND g.description = :genreName")
    long countByUserIdAndGenreName(@Param("userId") Long userId, @Param("genreName") String genreName);
}
