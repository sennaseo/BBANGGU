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
import org.springframework.http.ResponseCookie;
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
	public void kakaoLogin(@RequestParam("code") String authCode, HttpServletResponse response) throws IOException {
		try {
			JwtToken jwtToken = kakaoAuthService.handleKakaoLogin(authCode);

			// ✅ Refresh Token을 HttpOnly 쿠키로 저장
			ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", jwtToken.getRefreshToken())
				.httpOnly(true)  // JavaScript에서 접근 불가능
				.secure(true)  // HTTPS에서만 전송
				.path("/")  // 모든 경로에서 접근 가능
				.maxAge(7 * 24 * 60 * 60)  // 7일 유지
				.sameSite("Lax")  // CSRF 방지
				.build();

			response.addHeader("Set-Cookie", refreshTokenCookie.toString());

			// ✅ Access Token을 헤더에 추가
			response.setHeader("Authorization", "Bearer " + jwtToken.getAccessToken());

			// ✅ 강제 리다이렉트 실행
			response.setStatus(HttpServletResponse.SC_FOUND);  // 302 상태 코드 설정
			response.setHeader("Location", "http://localhost:5173/user");
			response.flushBuffer();  // 즉시 응답 완료 (추가 데이터 전송 방지)

		} catch (CustomException e) {
			response.sendError(e.getStatus().value(), e.getMessage());
		}
	}

}
