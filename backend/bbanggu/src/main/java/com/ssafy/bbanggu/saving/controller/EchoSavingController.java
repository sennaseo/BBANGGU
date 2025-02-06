package com.ssafy.bbanggu.saving.controller;

import java.util.Map;

import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.saving.dto.SavingResponse;
import com.ssafy.bbanggu.saving.dto.TotalSavingResponse;
import com.ssafy.bbanggu.saving.dto.UpdateSavingRequest;
import com.ssafy.bbanggu.saving.service.EchoSavingService;
import com.ssafy.bbanggu.user.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/saving")
@RequiredArgsConstructor
public class EchoSavingController {

	private final EchoSavingService echoSavingService;
	private final UserService userService;

	@GetMapping
	public ResponseEntity<ApiResponse> getUserSaving(Authentication authentication) {
		// ✅ Access Token이 없는 경우 예외처리
		if (authentication == null || authentication.getName() == null) {
			throw new CustomException(ErrorCode.INVALID_ACCESS_TOKEN);
		}

		// ✅ email 가져오기
		String email = authentication.getName();

		// ✅ email로 userId 조회
		Long userId = userService.getUserIdByEmail(email);

		SavingResponse response = echoSavingService.getUserSaving(userId);
		return ResponseEntity.ok(new ApiResponse("사용자의 절약 정보 조회 성공", response));
	}

	@PostMapping
	public ResponseEntity<ApiResponse> updateUserSaving(Authentication authentication,
		@RequestBody Map<String, Object> updates) {
		// ✅ Access Token이 없는 경우 예외 처리
		if (authentication == null || authentication.getName() == null) {
			throw new CustomException(ErrorCode.INVALID_ACCESS_TOKEN);
		}

		// ✅ email 가져오기
		String email = authentication.getName();

		// ✅ email로 userId 조회
		Long userId = userService.getUserIdByEmail(email);

		// ✅ 필수 필드 검증
		if (!updates.containsKey("reduce_co2e") || !updates.containsKey("saved_money")) {
			throw new CustomException(ErrorCode.MISSING_REQUIRED_FIELDS);
		}

		// ✅ 정보 갱신
		UpdateSavingRequest request = new UpdateSavingRequest((int) updates.get("reduce_co2e"), (int) updates.get("saved_money"));
		echoSavingService.updateUserSaving(userId, request);
		return ResponseEntity.ok(new ApiResponse("절약 정보 갱신 성공", null));
	}

	@GetMapping("/all")
	public ResponseEntity<ApiResponse> getTotalSaving() {
		TotalSavingResponse response = echoSavingService.getTotalSaving();
		return ResponseEntity.ok(new ApiResponse("전체 절약 정보 조회 성공", response));
	}
}
