package com.ssafy.bbanggu.stock;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.bbanggu.bakery.domain.Bakery;
import com.ssafy.bbanggu.bread.Bread;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StockService {
	private final StockRepository stockRepository;

	public void insertStock(StockDTO stockDto) {
		stockRepository.save(DtoToEntity(stockDto));
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

	public List<StockDTO> getStockByPeriod(LocalDate startDate, LocalDate endDate, long bakeryId) {
		List<Stock> stockList = stockRepository.findByBakery_BakeryIdAndDateBetween(bakeryId, startDate, endDate);
		stockList.sort(Comparator.comparing(Stock::getDate));
		List<StockDTO> stockDtoList = new ArrayList<>();
		for (Stock s : stockList) {
			stockDtoList.add(EntityToDTO(s));
		}
		return stockDtoList;
	}

	public Map<Integer, List<StockMonthDTO>> getYearlyStock(int year, long bakeryId) {
		LocalDate startOfYear = LocalDate.of(year, 1, 1);
		LocalDate endOfYear = LocalDate.of(year, 12, 31);

		// bakeryId와 날짜 범위로 Stock 데이터 조회
		List<Stock> stockList = stockRepository.findByBakery_BakeryIdAndDateBetween(bakeryId, startOfYear, endOfYear);

		for (int month = 1; month <= 12; month++) {
			StockMonthDTO stockMonthDTO = new StockMonthDTO();
			for (Stock s : stockList) {
				if (s.getDate().getMonthValue() == month) {

				}
			}
		}

		// 월별(1~12)로 재고를 빵 종류별로 합산할 맵을 생성 (월 → (빵ID → 총수량))
		// TreeMap을 사용하면 key가 정렬된 상태로 저장됨
		Map<Integer, Map<Long, Integer>> monthlyAggregation = new TreeMap<>();
		for (int month = 1; month <= 12; month++) {
			monthlyAggregation.put(month, new HashMap<>());
		}

		// 각 Stock 데이터를 해당 월의 해당 빵ID에 대해 누적합계 계산
		for (Stock stock : stockList) {
			int month = stock.getDate().getMonthValue();
			long breadId = stock.getBread().getBreadId();
			int quantity = stock.getQuantity();

			Map<Long, Integer> breadAggregation = monthlyAggregation.get(month);
			breadAggregation.put(breadId, breadAggregation.getOrDefault(breadId, 0) + quantity);
		}

		Map<Integer, List<StockMonthDTO>> result = new TreeMap<>();
		for (int month = 1; month <= 12; month++) {
			Map<Long, Integer> breadAggregation = monthlyAggregation.get(month);
			List<StockMonthDTO> aggregationList = new ArrayList<>();
			for (Map.Entry<Long, Integer> entry : breadAggregation.entrySet()) {
				aggregationList.add(new StockMonthDTO(entry.getKey(), entry.getValue()));
			}
			result.put(month, aggregationList);
		}
		return result;
	}

	public List<Object[]> getTop3StockByPeriod(long bakeryId, String period) {
		List<Object[]> result = null;
		if ("day".equals(period)) {
			result = stockRepository.findTop3BreadsByQuantityBetweenDates(bakeryId, LocalDate.now(), LocalDate.now());
		} else if ("week".equals(period)) {
			result = stockRepository.findTop3BreadsByQuantityBetweenDates(bakeryId, LocalDate.now().minusWeeks(1),
				LocalDate.now());
		} else if ("month".equals(period)) {
			result = stockRepository.findTop3BreadsByQuantityBetweenDates(bakeryId, LocalDate.now().minusMonths(1),
				LocalDate.now());
		} else if ("year".equals(period)) {
			result = stockRepository.findTop3BreadsByQuantityBetweenDates(bakeryId, LocalDate.now().minusYears(1),
				LocalDate.now());
		}
		return result;
	}

	private Stock DtoToEntity(StockDTO stockDto) {
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

	private StockDTO EntityToDTO(Stock stock) {
		return StockDTO.builder()
			.stockId(stock.getStockId())
			.bakeryId(stock.getBakery().getBakeryId())
			.breadId(stock.getBread().getBreadId())
			.quantity(stock.getQuantity())
			.date(stock.getDate())
			.build();
	}
}
