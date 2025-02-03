package com.ssafy.bbanggu.auth.controller;

import java.io.IOException;
import java.util.Map;

import com.ssafy.bbanggu.auth.service.KakaoAuthService;

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
	 * 🔹 카카오 로그인 페이지로 리다이렉트
	 */
	@GetMapping("/login")
	public ResponseEntity<Void> kakaoLogin(HttpServletResponse response) throws IOException {
		String kakaoAuthUrl = kakaoAuthService.getKakaoLoginUrl();
		System.out.println("카카오 로그인 URL: " + kakaoAuthUrl);

		// 클라이언트를 카카오 로그인 페이지로 리디렉트
		response.sendRedirect(kakaoAuthUrl);
		return ResponseEntity.status(HttpStatus.FOUND).build(); // 302 리디렉션 응답
	}


	/**
	 * 🔹 카카오 로그인 콜백 API (카카오에서 인증 코드 받음)
	 */
	@GetMapping("/callback")
	public ResponseEntity<Map<String, String>> kakaoCallback(@RequestParam("code") String authCode) {
		Map<String, String> tokenResponse = kakaoAuthService.kakaoLogin(authCode);
		return ResponseEntity.ok(tokenResponse);
	}
}
