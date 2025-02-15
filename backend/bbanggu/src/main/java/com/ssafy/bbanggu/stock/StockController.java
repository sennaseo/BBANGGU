package com.ssafy.bbanggu.stock;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.bbanggu.common.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/stock")
@RequiredArgsConstructor
public class StockController {
	private final StockService stockService;

	// 재고 등록
	@PostMapping("")
	public ResponseEntity<?> insertStock(@RequestBody StockDTO stockDto) {
		try {
			stockService.insertStock(stockDto);
			return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("재고 등록 성공", null));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("재고 등록 실패");
		}
	}

	// 재고 수정
	@PutMapping(value = "")
	public ResponseEntity<?> updateStock(@RequestBody StockDTO stockDto) {
		try {
			stockService.updateStock(stockDto);
			return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("재고 수정 성공", null));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("재고 수정 실패");
		}
	}

	// 재고 삭제
	@DeleteMapping(value = "/{stockId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> updateStock(@PathVariable long stockId) {
		try {
			stockService.deleteStock(stockId);
			return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("재고 삭제 성공", null));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("재고 삭제 실패");
		}
	}

	/*========== 재고 조회 ==========*/

	// 일별 조회
	@GetMapping("/bakery/{bakeryId}/day")
	public ResponseEntity<?> getStockDaily(@PathVariable long bakeryId) {
		try {
			List<StockDTO> stockList = stockService.getStockByPeriod(LocalDate.now(), LocalDate.now(), bakeryId);
			return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("재고 조회 성공", stockList));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("재고 조회 실패");
		}
	}

	// 주(지난 7일) 조회
	@GetMapping("/bakery/{bakeryId}/week")
	public ResponseEntity<?> getStockWeekly(@PathVariable long bakeryId) {
		try {
			List<StockDTO> stockList = stockService.getStockByPeriod(LocalDate.now().minusWeeks(1), LocalDate.now(),
				bakeryId);
			return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("재고 조회 성공", stockList));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("재고 조회 실패");
		}
	}

	// 월(지난 30일) 조회
	@GetMapping("/bakery/{bakeryId}/year/{year}")
	public ResponseEntity<?> getStockMonthly(@PathVariable long bakeryId, @PathVariable int year) {
		try {
			Map<Integer, List<StockMonthDTO>> stockList = stockService.getYearlyStock(year, bakeryId);
			return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("재고 조회 성공", stockList));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("재고 조회 실패");
		}
	}

	// 기간 기준 조회
	@GetMapping("/bakery/{bakeryId}/{startDate}/{endDate}")
	public ResponseEntity<?> getStockByPeriod(@PathVariable long bakeryId, @PathVariable LocalDate startDate,
		@PathVariable LocalDate endDate) {
		try {
			List<StockDTO> stockList = stockService.getStockByPeriod(startDate, endDate, bakeryId);
			return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("재고 조회 성공", stockList));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("재고 조회 실패");
		}
	}

	// TOP3 재고 조회
	@GetMapping("/bakery/{bakeryId}/top3/{period}")
	public ResponseEntity<?> getTop3Stock(@PathVariable long bakeryId, @PathVariable String period) {
		try {
			List<Object[]> stockList = stockService.getTop3StockByPeriod(bakeryId, period);
			return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("재고 조회 성공", stockList));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("재고 조회 실패");
		}
	}

}
