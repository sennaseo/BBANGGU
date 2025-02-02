package com.ssafy.bbanggu.auth.controller;

import com.ssafy.bbanggu.user.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

	private final UserService userService;

	public AuthenticationController(UserService userService) {
		this.userService = userService;
	}

	/**
	 * Refresh Token을 사용하여 새로운 Access Token을 발급
	 *
	 * @param authorizationHeader 클라이언트에서 전달받은 Refresh Token (Authorization 헤더)
	 * @return 새로운 Access Token
	 */
	@PostMapping("/token/refresh")
	public ResponseEntity<?> refreshAccessToken(
		@RequestHeader("Authorization") String authorizationHeader) {
		System.out.println("authorizationHeader: " + authorizationHeader);
		if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(Map.of("message", "Invalid or missing Authorization header"));
		}

		// Bearer 접두사 제거
		String refreshToken = authorizationHeader.substring(7);

		// Access Token 재발급
		String newAccessToken = userService.refreshAccessToken(refreshToken);

		return ResponseEntity.ok(Map.of("access_token", newAccessToken));
	}
}
