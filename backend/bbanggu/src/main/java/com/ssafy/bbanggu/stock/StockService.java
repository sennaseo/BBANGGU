package com.ssafy.bbanggu.stock;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.bbanggu.bakery.Bakery;
import com.ssafy.bbanggu.bread.Bread;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StockService {
	private final StockRepository stockRepository;

	public Stock insertStock(StockDTO stockDto) {

		Bakery bakery = Bakery.builder()
			.bakeryId(stockDto.getBakeryId())
			.build();

		Bread bread = Bread.builder()
			.breadId(stockDto.getBreadId())
			.build();

		Stock stock = Stock.builder()
			.bakery(bakery)
			.bread(bread)
			.quantity(stockDto.getQuantity())
			.createdAt(LocalDateTime.now())
			.build();

		return stockRepository.save(stock);
	}

	public void updateStock(StockDTO stockDto) {
	}
}
