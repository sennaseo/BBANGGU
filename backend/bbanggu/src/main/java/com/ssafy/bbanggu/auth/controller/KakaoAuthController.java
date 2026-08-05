package com.ssafy.bbanggu.auth.controller;

import java.io.IOException;

import com.ssafy.bbanggu.auth.dto.JwtToken;
import com.ssafy.bbanggu.auth.security.AuthCookieFactory;
import com.ssafy.bbanggu.auth.service.KakaoAuthService;
import com.ssafy.bbanggu.common.config.KakaoConfig;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.response.ApiResponse;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/oauth/kakao")
@RequiredArgsConstructor
public class KakaoAuthController {

	private final KakaoAuthService kakaoAuthService;
	private final KakaoConfig kakaoConfig;
	private final AuthCookieFactory cookieFactory;

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

			// ✅ Access Token과 Refresh Token을 쿠키에 저장 (secure 분기·path 제한은 팩토리가 관리)
			response.addHeader(HttpHeaders.SET_COOKIE, cookieFactory.accessToken(jwtToken.getAccessToken()).toString());
			response.addHeader(HttpHeaders.SET_COOKIE, cookieFactory.refreshToken(jwtToken.getRefreshToken()).toString());

			// ✅ 토큰은 httpOnly 쿠키로만 전달 — URL 쿼리에 실으면 브라우저 히스토리·로그에 남는다
			String redirectUrl = kakaoConfig.getFrontBaseUrl() + "/oauth/kakao/callback?auth=success";

			response.setStatus(HttpServletResponse.SC_FOUND);
			response.setHeader("Location", redirectUrl);
			response.flushBuffer();

		} catch (CustomException e) {
			response.sendError(e.getStatus().value(), e.getMessage());
		}
	}

}
