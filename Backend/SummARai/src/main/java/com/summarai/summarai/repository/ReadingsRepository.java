package com.summarai.summarai.repository;

import com.summarai.summarai.dto.GenreCountDTO;
import com.summarai.summarai.model.User;
import com.summarai.summarai.model.UserReading;
import com.summarai.summarai.model.UserReadingId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
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


    @Query("""
    SELECT new com.summarai.summarai.dto.GenreCountDTO(g.description, COUNT(g))
    FROM UserReading ur
    JOIN TREAT(ur.summary AS BookSummary) s
    JOIN s.genres g
    WHERE ur.user.id = :userId AND ur.finished = true
    GROUP BY g.description
    """)
    List<GenreCountDTO> getGenreCountsByUserId(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserReading u WHERE u.summary.id = :summaryId")
    int deleteBySummaryId(@Param("summaryId") Long summaryId);
}
