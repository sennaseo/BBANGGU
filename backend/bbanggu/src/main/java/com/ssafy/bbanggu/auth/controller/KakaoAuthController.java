package com.ssafy.bbanggu.auth.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.ssafy.bbanggu.auth.dto.JwtToken;
import com.ssafy.bbanggu.auth.service.KakaoAuthService;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.response.ApiResponse;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/oauth/kakao")
@RequiredArgsConstructor
public class KakaoAuthController {

	private final KakaoAuthService kakaoAuthService;

	/**
	 * ✅ 1. 카카오 로그인 요청 (Redirect)
	 * - 클라이언트가 이 API를 호출하면, Kakao OAuth 로그인 페이지로 리다이렉트됨.
	 */
	@GetMapping("/login")
	public ResponseEntity<ApiResponse> redirectToKakaoLogin() {
		String redirectUrl = kakaoAuthService.getKakaoLoginUrl();
		return ResponseEntity.ok(new ApiResponse("카카오 로그인 URL 생성", redirectUrl));
	}


	/**
	 * ✅ 2. 카카오 로그인 Callback
	 * - Kakao 인증 후 리다이렉트되는 API.
	 * - authorizationCode를 받아 Kakao Access Token 요청 → 사용자 정보 조회 → JWT 발급 후 반환
	 */
	@GetMapping("/callback")
	public ResponseEntity<ApiResponse> kakaoLogin(@RequestParam("code") String authCode) {
		try {
			JwtToken jwtToken = kakaoAuthService.handleKakaoLogin(authCode);

			Map<String, String> tokenData = new HashMap<>();
			tokenData.put("accessToken", jwtToken.getAccessToken());
			tokenData.put("refreshToken", jwtToken.getRefreshToken());

			return ResponseEntity.ok(new ApiResponse("카카오 로그인 성공", jwtToken));
		} catch (CustomException e) {
			return ResponseEntity.status(e.getStatus()).body(new ApiResponse(e.getMessage(), null));
		}
	}
}
