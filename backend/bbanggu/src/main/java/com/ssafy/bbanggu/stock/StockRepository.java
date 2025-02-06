package com.ssafy.bbanggu.stock;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface StockRepository extends JpaRepository<Stock, Long> {
	List<Stock> findByBakery_BakeryIdAndDateBetween(long bakeryId, LocalDate startDate, LocalDate endDate);
}
