package com.ssafy.bbanggu.stock;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

import com.ssafy.bbanggu.ai.dto.InventoryItemDto;

public interface StockRepository extends JpaRepository<Stock, Long> {
	List<Stock> findByBakery_BakeryIdAndDateBetween(long bakeryId, LocalDate startDate, LocalDate endDate);

	List<InventoryItemDto> findByBakery_BakeryId(Long bakeryId);
}
