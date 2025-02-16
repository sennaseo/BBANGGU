package com.ssafy.bbanggu.stock;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.bbanggu.ai.dto.InventoryItemDto;

public interface StockRepository extends JpaRepository<Stock, Long> {
	List<Stock> findByBakery_BakeryIdAndDateBetween(long bakeryId, LocalDate startDate, LocalDate endDate);

	List<InventoryItemDto> findByBakery_BakeryId(Long bakeryId);

	@Query("SELECT s.bread.name, SUM(s.quantity) " +
		"FROM Stock s " +
		"WHERE s.date BETWEEN :startAt AND :endAt " +
		"AND s.bakery.bakeryId = :bakeryId " +
		"GROUP BY s.bread.breadId " +
		"ORDER BY SUM(s.quantity) DESC " +
		"LIMIT 3")
	List<Object[]> findTop3BreadsByQuantityBetweenDates(
		@Param("bakeryId") Long bakeryId,
		@Param("startAt") LocalDate startAt,
		@Param("endAt") LocalDate endAt
	);

	@Query("SELECT SUM(s.quantity) FROM Stock s WHERE s.bakery.bakeryId = :bakeryId")
	int findSumQuantityByBakery_BakeryId(@Param("bakeryId") Long bakeryId);
}
