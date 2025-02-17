package com.ssafy.bbanggu.stock;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.bbanggu.bakery.domain.Bakery;
import com.ssafy.bbanggu.bread.Bread;
import com.ssafy.bbanggu.bread.BreadService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StockService {
	private final StockRepository stockRepository;
	private final BreadService breadService;

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

	public List<StockWeekDTO> getLast7DaysStockSummary(long bakeryId) {
		LocalDate endDate = LocalDate.now();
		LocalDate startDate = endDate.minusDays(6);

		List<StockWeekDTO> summaries = stockRepository
			.findDailySummaryByBakeryAndDateRange(bakeryId, startDate, endDate);

		Map<LocalDate, Integer> summaryMap = summaries.stream()
			.collect(Collectors.toMap(
				StockWeekDTO::getDate,
				StockWeekDTO::getTotalQuantity
			));

		List<StockWeekDTO> result = new ArrayList<>();
		for (int i = 6; i >= 0; i--) {
			LocalDate date = endDate.minusDays(i);
			Integer quantity = summaryMap.getOrDefault(date, 0);
			result.add(new StockWeekDTO(date, quantity));
		}

		return result;
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

	public Map<Integer, List<StockMonthDTO>> getYearlyStock(long bakeryId) {
		LocalDate now = LocalDate.now();
		LocalDate startDate = now.minusMonths(11);

		List<Stock> stockList = stockRepository.findByBakery_BakeryIdAndDateBetween(
			bakeryId, startDate, now
		);

		// YearMonth를 키로 사용하여 날짜순 정렬을 보장
		Map<YearMonth, Map<Long, Integer>> monthlyData = new TreeMap<>();

		// Stock 데이터 집계
		for (Stock stock : stockList) {
			YearMonth yearMonth = YearMonth.from(stock.getDate());
			long breadId = stock.getBread().getBreadId();
			int quantity = stock.getQuantity();

			monthlyData.computeIfAbsent(yearMonth, k -> new HashMap<>())
				.merge(breadId, quantity, Integer::sum);
		}

		// 결과를 월별로 변환
		Map<Integer, List<StockMonthDTO>> result = new LinkedHashMap<>();

		// startDate부터 now까지 순회하며 데이터가 있는 월만 결과 맵에 추가
		YearMonth current = YearMonth.from(startDate);
		YearMonth end = YearMonth.from(now);

		while (!current.isAfter(end)) {
			Map<Long, Integer> breadData = monthlyData.get(current);

			// 해당 월에 데이터가 있는 경우에만 결과에 추가
			if (breadData != null && !breadData.isEmpty()) {
				List<StockMonthDTO> monthData = new ArrayList<>();
				for (Map.Entry<Long, Integer> entry : breadData.entrySet()) {
					monthData.add(new StockMonthDTO(entry.getKey(), entry.getValue()));
				}
				result.put(current.getMonthValue(), monthData);
			}

			current = current.plusMonths(1);
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

		return Optional.ofNullable(result).orElse(Collections.emptyList());
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
			.breadName(stock.getBread().getName())
			.quantity(stock.getQuantity())
			.date(stock.getDate())
			.build();
	}

	public int countTotalStock(long bakeryId, String period) {
		int result = -1;
		if ("day".equals(period)) {
			result = stockRepository.findSumQuantityByBakery_BakeryIdAndDateBetween(bakeryId, LocalDate.now(),
				LocalDate.now());
		} else if ("week".equals(period)) {
			result = stockRepository.findSumQuantityByBakery_BakeryIdAndDateBetween(bakeryId,
				LocalDate.now().minusWeeks(1),
				LocalDate.now());
		} else if ("month".equals(period)) {
			result = stockRepository.findSumQuantityByBakery_BakeryIdAndDateBetween(bakeryId,
				LocalDate.now().minusMonths(1),
				LocalDate.now());
		} else if ("year".equals(period)) {
			result = stockRepository.findSumQuantityByBakery_BakeryIdAndDateBetween(bakeryId,
				LocalDate.now().minusYears(1),
				LocalDate.now());
		}
		return result;
	}
}
