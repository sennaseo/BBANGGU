package com.ssafy.bbanggu.auth.controller;

import com.ssafy.bbanggu.auth.service.AuthenticationService;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.user.service.UserService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
	private final AuthenticationService authService;

	public AuthenticationController(AuthenticationService authService) {
		this.authService = authService;
	}

	/**
	 * AccessToken 재발급 API
	 */
	@PostMapping("/token/refresh")
	public ResponseEntity<ApiResponse> refresh(@CookieValue("refreshToken") String refreshToken) {
		String newAccessToken = authService.refreshAccessToken(refreshToken);

		// 새로운 AccessToken 쿠키 설정
		ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", newAccessToken)
			.httpOnly(true)
			.secure(true)
			.path("/")
			.maxAge(30 * 60)
			.build();

		return ResponseEntity.ok()
			.header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
			.body(new ApiResponse("AccessToken 재발급이 성공적으로 완료되었습니다.", null));
	}
}
