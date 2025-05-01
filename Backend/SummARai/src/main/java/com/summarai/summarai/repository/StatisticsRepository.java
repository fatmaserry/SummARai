package com.summarai.summarai.repository;

import com.summarai.summarai.model.Statistics;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatisticsRepository extends JpaRepository<Statistics,Long> {
}
