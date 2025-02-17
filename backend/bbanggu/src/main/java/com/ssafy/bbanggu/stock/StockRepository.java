package com.ssafy.bbanggu.stock;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StockRepository extends JpaRepository<Stock, Long> {

	List<Stock> findByBakery_BakeryIdAndDateBetween(long bakeryId, LocalDate startDate, LocalDate endDate);

	@Query("SELECT NEW com.ssafy.bbanggu.stock.StockWeekDTO(s.date, CAST(SUM(s.quantity) AS integer)) " +
		"FROM Stock s " +
		"WHERE s.bakery.bakeryId = :bakeryId " +
		"AND s.date BETWEEN :startDate AND :endDate " +
		"GROUP BY s.date " +
		"ORDER BY s.date ASC")
	List<StockWeekDTO> findDailySummaryByBakeryAndDateRange(
		@Param("bakeryId") long bakeryId,
		@Param("startDate") LocalDate startDate,
		@Param("endDate") LocalDate endDate
	);

	@Query(value = "SELECT b.name, SUM(s.quantity) " +
		"FROM stock s " +
		"JOIN bread b ON s.bread_id = b.bread_id " +
		"WHERE s.date BETWEEN :startAt AND :endAt " +
		"AND s.bakery_id = :bakeryId " +
		"GROUP BY b.bread_id " +
		"ORDER BY SUM(s.quantity) DESC " +
		"LIMIT 3", nativeQuery = true)
	List<Object[]> findTop3BreadsByQuantityBetweenDates(
		@Param("bakeryId") Long bakeryId,
		@Param("startAt") LocalDate startAt,
		@Param("endAt") LocalDate endAt
	);

	@Query("SELECT SUM(s.quantity) FROM Stock s WHERE s.bakery.bakeryId = :bakeryId AND s.date BETWEEN :startDate AND :endDate")
	int findSumQuantityByBakery_BakeryIdAndDateBetween(@Param("bakeryId") Long bakeryId,
		@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

}
