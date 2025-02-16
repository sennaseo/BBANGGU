package com.ssafy.bbanggu.ai.controller;

import java.util.Currency;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.ssafy.bbanggu.ai.dto.InventoryRequestDto;
import com.ssafy.bbanggu.ai.dto.InventoryResponseDto;
import com.ssafy.bbanggu.ai.service.InventoryService;
import com.ssafy.bbanggu.auth.security.CustomUserDetails;

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
	public ResponseEntity<InventoryResponseDto> analyzeInventory(
		@AuthenticationPrincipal CustomUserDetails userDetails
	) {
		InventoryResponseDto response = inventoryService.analyzeInventory(userDetails);
		return ResponseEntity.ok(response);
	}
}
