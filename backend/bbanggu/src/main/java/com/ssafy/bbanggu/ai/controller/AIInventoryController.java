package com.ssafy.bbanggu.ai.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.bbanggu.ai.service.InventoryService;
import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.common.response.ApiResponse;

import lombok.RequiredArgsConstructor;

/**
 * AI 분석 결과 반환
 */
@RestController
@RequestMapping("/analyze")
@RequiredArgsConstructor
public class AIInventoryController {

	private final InventoryService inventoryService;

	@PostMapping("/{bakeryId}")
	public ResponseEntity<?> analyzeInventory(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@PathVariable long bakeryId) {
		String response = inventoryService.getResponse(bakeryId);
		return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("gpt 응답 성공", response));
	}
}
