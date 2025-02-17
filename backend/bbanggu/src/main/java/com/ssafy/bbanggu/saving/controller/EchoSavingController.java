package com.ssafy.bbanggu.saving.controller;

import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.saving.dto.SavingDto;
import com.ssafy.bbanggu.saving.service.EchoSavingService;
import com.ssafy.bbanggu.user.repository.UserRepository;
import com.ssafy.bbanggu.user.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/saving")
@RequiredArgsConstructor
public class EchoSavingController {

	private final EchoSavingService echoSavingService;

	/**
	 * 절약 정보 조회 API
	 *
	 * @param userDetails 현재 로그인한 사용자 정보
	 * @return savedMoney, reducedCo2e
	 */
	@GetMapping
	public ResponseEntity<ApiResponse> getUserSaving(@AuthenticationPrincipal CustomUserDetails userDetails) {
		SavingDto response = echoSavingService.getUserSaving(userDetails);
		return ResponseEntity.ok(new ApiResponse("사용자의 절약 정보 조회가 완료되었습니다.", response));
	}


	/**
	 * 절약 정보 업데이트 API
	 *
	 * @param userDetails 현재 로그인한 사용자 정보
	 * @param updates savedMoney, reducedCo2e
	 * @return ok 응답
	 */
	@PostMapping
	public ResponseEntity<ApiResponse> updateUserSaving(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@RequestBody SavingDto updates
	) {
		echoSavingService.updateUserSaving(userDetails, updates);
		return ResponseEntity.ok(new ApiResponse("절약 정보 업데이트가 완료되었습니다.", null));
	}


	/**
	 * 전체 유저의 절약 정보 조회 API
	 * @return savedMoney, reducedCo2e
	 */
	@GetMapping("/all")
	public ResponseEntity<ApiResponse> getTotalSaving() {
		SavingDto response = echoSavingService.getTotalSaving();
		return ResponseEntity.ok(new ApiResponse("전체 절약 정보 조회 성공", response));
	}

}
