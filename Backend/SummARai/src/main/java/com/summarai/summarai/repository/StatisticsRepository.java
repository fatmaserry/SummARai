package com.summarai.summarai.repository;

import com.summarai.summarai.model.Statistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatisticsRepository extends JpaRepository<Statistics,Long> {
}
