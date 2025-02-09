package com.ssafy.bbanggu.saving.controller;

import java.util.Map;

import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.saving.dto.SavingResponse;
import com.ssafy.bbanggu.saving.service.EchoSavingService;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;
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
	private final UserRepository userRepository;
	private final UserService userService;

	@GetMapping
	public ResponseEntity<ApiResponse> getUserSaving(Authentication authentication) {
		User user = userRepository.findById(Long.parseLong(authentication.getName()))
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		SavingResponse response = echoSavingService.getUserSaving(user.getUserId());
		return ResponseEntity.ok(new ApiResponse("사용자의 절약 정보 조회 성공", response));
	}

	@PostMapping
	public ResponseEntity<ApiResponse> updateUserSaving(Authentication authentication,
		@RequestBody Map<String, Object> updates) {
		User user = userRepository.findById(Long.parseLong(authentication.getName()))
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// ✅ 필수 필드 검증
		if (!updates.containsKey("reduce_co2e") || !updates.containsKey("saved_money")) {
			throw new CustomException(ErrorCode.MISSING_REQUIRED_FIELDS);
		}

		echoSavingService.updateUserSaving(user.getUserId(), (int) updates.get("reduce_co2e"), (int) updates.get("saved_money"));
		return ResponseEntity.ok(new ApiResponse("절약 정보 갱신 성공", null));
	}

	@GetMapping("/all")
	public ResponseEntity<ApiResponse> getTotalSaving() {
		SavingResponse response = echoSavingService.getTotalSaving();
		return ResponseEntity.ok(new ApiResponse("전체 절약 정보 조회 성공", response));
	}
}
