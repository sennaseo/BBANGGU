package com.ssafy.bbanggu.saving.controller;

import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.saving.dto.SavingResponse;
import com.ssafy.bbanggu.saving.dto.TotalSavingResponse;
import com.ssafy.bbanggu.saving.dto.UpdateSavingRequest;
import com.ssafy.bbanggu.saving.service.EchoSavingService;
import lombok.RequiredArgsConstructor;

import com.ssafy.bbanggu.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/saving")
@RequiredArgsConstructor
public class EchoSavingController {

	private final EchoSavingService echoSavingService;

	@GetMapping
	public ResponseEntity<SavingResponse> getUserSaving() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || !authentication.isAuthenticated()) {
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}

		Object principal = authentication.getPrincipal();
		Long userId = null;

		if (principal instanceof String) { // Principal이 String인지 확인
			try {
				userId = Long.parseLong((String) principal); // String → Long 변환
			} catch (NumberFormatException e) {
				throw new CustomException(ErrorCode.ACCOUNT_DEACTIVATED);
			}
		} else {
			System.out.println("Unexpected Principal type: " + principal);
			return ResponseEntity.status(403).build();
		}

		return ResponseEntity.ok(echoSavingService.getUserSaving(userId));
	}

	// 누적 탄소 절감량 및 절약 금액 갱신
	@PostMapping
	public ResponseEntity<?> updateUserSaving(
		@RequestBody UpdateSavingRequest request) {

		// SecurityContext에서 userId 직접 추출
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || authentication.getPrincipal() == null) {
			return ResponseEntity.status(401).body("{\"message\": \"Unauthorized user\"}");
		}

		Long userId;
		try {
			userId = Long.valueOf(authentication.getPrincipal().toString());
		} catch (NumberFormatException e) {
			return ResponseEntity.status(401).body("{\"message\": \"Invalid user ID\"}");
		}

		echoSavingService.updateUserSaving(userId, request);
		return ResponseEntity.ok().body("{\"message\": \"Saving data updated successfully.\"}");
	}

	// 전체 유저의 누적 탄소 절감량 및 절약 금액 조회
	@GetMapping("/all")
	public ResponseEntity<TotalSavingResponse> getTotalSaving() {
		TotalSavingResponse response = echoSavingService.getTotalSaving();
		return ResponseEntity.ok(response);
	}
}
