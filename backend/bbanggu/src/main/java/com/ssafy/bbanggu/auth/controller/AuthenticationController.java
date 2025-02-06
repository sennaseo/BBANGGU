package com.ssafy.bbanggu.auth.controller;

import com.ssafy.bbanggu.auth.service.AuthenticationService;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
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
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
	private final AuthenticationService authService;

	/**
	 * AccessToken 재발급 API
	 */
	@PostMapping("/token/refresh")
	public ResponseEntity<ApiResponse> refresh(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
		if (refreshToken == null) {
			throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
		}

		String newAccessToken = authService.refreshAccessToken(refreshToken);

		// 새로운 Refresh Token 쿠키 설정
		ResponseCookie newRefreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
			.httpOnly(true)
			.secure(true)
			.path("/")
			.maxAge(60)  //7 * 24 * 60 * 60) // 7일
			.build();

		// 새로운 Access Token 쿠키 설정
		ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", newAccessToken)
			.httpOnly(true)
			.secure(true)
			.path("/")
			.maxAge(30) // * 60)
			.build();

		return ResponseEntity.ok()
			.header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
			.header(HttpHeaders.SET_COOKIE, newRefreshTokenCookie.toString())
			.body(new ApiResponse("AccessToken 재발급이 성공적으로 완료되었습니다.", null));
	}
}
