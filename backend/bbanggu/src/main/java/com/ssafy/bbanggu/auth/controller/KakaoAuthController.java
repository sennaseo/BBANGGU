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
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;

@Slf4j
@RestController
@RequestMapping("/oauth/kakao")
@RequiredArgsConstructor
public class KakaoAuthController {

	private final KakaoAuthService kakaoAuthService;
	
	@Value("${kakao.client-id}")
	private String kakaoClientId;

	/**
	 * ✅ 1. 카카오 로그인 요청 (Redirect)
	 * - 클라이언트가 이 API를 호출하면, Kakao OAuth 로그인 페이지로 리다이렉트됨.
	 */
	@GetMapping("/login")
	public ResponseEntity<ApiResponse> redirectToKakaoLogin(HttpServletRequest request) {
		String redirectUrl = "https://kauth.kakao.com/oauth/authorize"
			+ "?client_id=" + kakaoClientId
			+ "&redirect_uri=" + "https://i12d102.p.ssafy.io/api/oauth/kakao/callback"
			+ "&response_type=code";
		
		log.info("카카오 로그인 URL: {}", redirectUrl);
		return ResponseEntity.ok(new ApiResponse("카카오 로그인 URL 생성", redirectUrl));
	}


	/**
	 * ✅ 2. 카카오 로그인 Callback
	 * - Kakao 인증 후 리다이렉트되는 API.
	 * - authorizationCode를 받아 Kakao Access Token 요청 → 사용자 정보 조회 → JWT 발급 후 반환
	 */
	@GetMapping("/callback")
	public void kakaoLogin(
		@RequestParam("code") String authCode, 
		HttpServletRequest request,
		HttpServletResponse response
	) throws IOException {
		try {
			JwtToken jwtToken = kakaoAuthService.handleKakaoLogin(authCode);

			log.info("카카오 콜백 성공!@@@");
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

			// 요청이 온 프로토콜(http/https)과 호스트를 사용하여 리다이렉션
			String referer = request.getHeader("Referer");  // 요청이 온 원래 URL
			String scheme = request.getHeader("X-Forwarded-Proto");  // http 또는 https
			String host = request.getHeader("X-Forwarded-Host");  // 도메인
			
			if (host == null) {
				host = request.getHeader("Host");
			}
			
			String redirectUrl = scheme + "://" + host + "/user";
			response.setHeader("Location", redirectUrl);
			
			// 디버깅을 위한 로그 추가
			log.info("인증 코드: {}", authCode);
			log.info("리다이렉트 URL: {}", redirectUrl);
			
			response.flushBuffer();

		} catch (CustomException e) {
			response.sendError(e.getStatus().value(), e.getMessage());
		}
	}

}
