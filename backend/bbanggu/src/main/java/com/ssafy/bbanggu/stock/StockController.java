package com.ssafy.bbanggu.stock;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.bbanggu.auth.dto.ApiResponse;

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
			Stock insertedStock = stockService.insertStock(stockDto);
			return ApiResponse();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("재고 등록 실패");
		}
	}

	@PutMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> updateStock(@RequestBody StockDTO stockDto) {
		try {
			System.out.println("dto: " + stockDto);
			stockService.updateStock(stockDto);

			return ResponseEntity.ok("빵 수정 성공: ID = " + insertedBread.getBreadId());
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("빵 등록 실패");
		}
	}
}
