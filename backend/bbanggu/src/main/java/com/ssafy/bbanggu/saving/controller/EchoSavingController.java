package com.ssafy.bbanggu.saving.controller;

import com.ssafy.bbanggu.saving.dto.SavingResponse;
import com.ssafy.bbanggu.saving.dto.TotalSavingResponse;
import com.ssafy.bbanggu.saving.dto.UpdateSavingRequest;
import com.ssafy.bbanggu.saving.service.EchoSavingService;
import com.ssafy.bbanggu.user.domain.User;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/saving")
@RequiredArgsConstructor
@Tag(name = "Saving", description = "유저 절약 금액 및 탄소 절감량 관련 API")
public class EchoSavingController {

	private final EchoSavingService echoSavingService;

	@Operation(summary = "유저의 누적 탄소 절감량 및 절약 금액 조회", description = "현재 로그인된 유저의 절약 금액 및 탄소 절감량을 조회합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "성공"),
		@ApiResponse(responseCode = "401", description = "유효하지 않은 토큰 또는 인증 정보")
	})
	@GetMapping
	public ResponseEntity<SavingResponse> getUserSaving() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || !authentication.isAuthenticated()) {
			System.out.println("Security Context가 null이거나 인증되지 않음");
			return ResponseEntity.status(403).build();
		}

		Object principal = authentication.getPrincipal();
		Long userId = null;

		if (principal instanceof String) { // 🔹 Principal이 String인지 확인
			try {
				userId = Long.parseLong((String) principal); // 🔹 String → Long 변환
			} catch (NumberFormatException e) {
				System.out.println("Failed to parse userId from SecurityContext: " + principal);
				return ResponseEntity.status(403).build();
			}
		} else {
			System.out.println("Unexpected Principal type: " + principal);
			return ResponseEntity.status(403).build();
		}

		System.out.println("SecurityContext에서 추출한 userId: " + userId);
		return ResponseEntity.ok(echoSavingService.getUserSaving(userId));
	}

	@Operation(summary = "유저의 누적 탄소 절감량 및 절약 금액 갱신", description = "현재 로그인된 유저의 절약 금액 및 탄소 절감량을 갱신합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "갱신 성공"),
		@ApiResponse(responseCode = "400", description = "필수 파라미터 누락 또는 형식 오류"),
		@ApiResponse(responseCode = "401", description = "유효하지 않은 토큰 또는 인증 정보")
	})
	@PostMapping
	public ResponseEntity<?> updateUserSaving(
		@RequestBody UpdateSavingRequest request) {

		// 🔹 SecurityContext에서 userId 직접 추출
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

	@Operation(summary = "전체 유저의 누적 탄소 절감량 및 절약 금액 조회", description = "빵구 서비스 전체 유저의 절약 금액 및 탄소 절감량을 조회합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "성공")
	})
	@GetMapping("/all")
	public ResponseEntity<TotalSavingResponse> getTotalSaving() {
		TotalSavingResponse response = echoSavingService.getTotalSaving();
		return ResponseEntity.ok(response);
	}
}
