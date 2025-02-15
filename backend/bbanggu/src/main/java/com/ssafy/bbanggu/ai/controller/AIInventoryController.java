package com.ssafy.bbanggu.ai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ssafy.bbanggu.ai.dto.InventoryRequestDto;
import com.ssafy.bbanggu.ai.dto.InventoryResponseDto;
import com.ssafy.bbanggu.ai.service.InventoryService;

import lombok.RequiredArgsConstructor;

/**
 * AI 분석 결과 반환
 */
@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class AIInventoryController {

	private final InventoryService inventoryService;

	@PostMapping("/analyze")
	public ResponseEntity<InventoryResponseDto> analyzeInventory(@RequestBody InventoryRequestDto requestDto) {
		InventoryResponseDto response = inventoryService.analyzeInventory(requestDto);
		return ResponseEntity.ok(response);
	}
}
