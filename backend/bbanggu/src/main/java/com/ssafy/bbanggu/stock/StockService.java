package com.ssafy.bbanggu.stock;

import java.time.LocalDate;
import java.util.List;

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

	public void insertStock(StockDTO stockDto) {
		stockRepository.save(convertDtoToEntity(stockDto));
	}

	public void updateStock(StockDTO stockDto) {
		Stock stock = stockRepository.findById(stockDto.getStockId())
			.orElseThrow(() -> new RuntimeException("Stock not found"));
		stock.setQuantity(stock.getQuantity());
		stock.setBread(stock.getBread());
	}

	public void deleteStock(long stockId) {
		stockRepository.deleteById(stockId);
	}

	private Stock convertDtoToEntity(StockDTO stockDto) {
		Bakery bakery = Bakery.builder()
			.bakeryId(stockDto.getBakeryId())
			.build();

		Bread bread = Bread.builder()
			.breadId(stockDto.getBreadId())
			.build();

		return Stock.builder()
			.bakery(bakery)
			.bread(bread)
			.quantity(stockDto.getQuantity())
			.date(LocalDate.now())
			.build();
	}

	public List<Stock> getStockByPeriod(LocalDate startDate, LocalDate endDate) {
		return null;
	}
}
