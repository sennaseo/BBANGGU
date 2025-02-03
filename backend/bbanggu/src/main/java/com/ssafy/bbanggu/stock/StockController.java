package com.ssafy.bbanggu.stock;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bbanggu.bread.Bread;
import com.ssafy.bbanggu.bread.BreadDTO;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/stock")
@RequiredArgsConstructor
public class StockController {
	private final StockService stockService;

	// 재고 등록
	@PostMapping("")
	public ResponseEntity<String> insertStock(@RequestParam("stock") String stockDtoJson) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			StockDTO breadDto = objectMapper.readValue(stockDtoJson, StockDTO.class);
			Bread insertedBread = stockService.insertStock();
			return ResponseEntity.ok("재고 등록 성공: ID = " + insertedBread.getBreadId());
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("재고 등록 실패");
		}
	}
}
