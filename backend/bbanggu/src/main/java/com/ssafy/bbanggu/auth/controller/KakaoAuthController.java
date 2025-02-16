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
		String scheme = request.getHeader("X-Forwarded-Proto");
		String host = request.getHeader("X-Forwarded-Host");
		if (host == null) {
			host = request.getHeader("Host");
		}
		
		String callbackUrl = scheme + "://" + host + "/kakao/callback";
		
		String kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize"
			+ "?client_id=" + kakaoClientId
			+ "&redirect_uri=" + callbackUrl
			+ "&response_type=code";
		
		log.info("카카오 로그인 URL: {}", kakaoAuthUrl);
		return ResponseEntity.ok(new ApiResponse("카카오 로그인 URL 생성", kakaoAuthUrl));
	}


	/**
	 * ✅ 2. 카카오 로그인 Callback
	 * - Kakao 인증 후 리다이렉트되는 API.
	 * - authorizationCode를 받아 Kakao Access Token 요청 → 사용자 정보 조회 → JWT 발급 후 반환
	 */
	@GetMapping("/callback")
	public ResponseEntity<ApiResponse> kakaoLogin(
		@RequestParam("code") String authCode, 
		HttpServletRequest request,
		HttpServletResponse response
	) throws IOException {
		try {
			log.info("받은 인가 코드: {}", authCode);
			
			JwtToken jwtToken = kakaoAuthService.handleKakaoLogin(authCode);
			
			ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", jwtToken.getRefreshToken())
				.httpOnly(true)
				.secure(true)
				.path("/")
				.maxAge(7 * 24 * 60 * 60)
				.sameSite("Lax")
				.build();
			
			response.addHeader("Set-Cookie", refreshTokenCookie.toString());
			response.setHeader("Authorization", "Bearer " + jwtToken.getAccessToken());
			
			return ResponseEntity.ok(new ApiResponse("로그인 성공", null));
			
		} catch (CustomException e) {
			log.error("로그인 처리 중 에러 발생: {}", e.getMessage());
			return ResponseEntity.status(e.getStatus())
				.body(new ApiResponse(e.getMessage(), null));
		}
	}

}
