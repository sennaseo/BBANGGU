package com.ssafy.bbanggu.auth.controller;

import com.ssafy.bbanggu.auth.security.JwtTokenProvider;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
	private final JwtTokenProvider jwtTokenProvider;
	private final UserRepository userRepository;

	/**
	 * AccessToken 재발급 API
	 */
	@PostMapping("/token/refresh")
	public ResponseEntity<ApiResponse> refreshAccessToken(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
		// 1️⃣ 쿠키에서 refresh token 가져오기
		if (refreshToken == null) {
			throw new CustomException(ErrorCode.REFRESH_TOKEN_NOT_EXIST);
		}

		// 2️⃣ refresh token 유효성 검증
		if (!jwtTokenProvider.validateToken(refreshToken)) {
			throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
		}

		// 3️⃣ refresh token에서 사용자 정보 추출
		Long userId = jwtTokenProvider.getUserIdFromToken(refreshToken);

		// 4️⃣ 사용자 조회 (DB에서 refresh token 일치 여부 확인)
		Optional<User> user = userRepository.findById(userId);
		if (user.isEmpty() || !refreshToken.equals(user.get().getRefreshToken())) {
			throw new CustomException(ErrorCode.NOT_MATCHED_AUTH_INFO);
		}

		// 5️⃣ 새로운 Access Token 생성
		String newAccessToken = jwtTokenProvider.createAccessToken(userId);
		String newRefreshToken = refreshToken;

		// 6️⃣ Sliding Refresh 적용 (Refresh Token이 24시간 이하로 남았을 때만 새로 발급)
		long refreshTokenRemainingTime = jwtTokenProvider.getRemainingExpirationTime(refreshToken); // 남은 만료 시간

		if (refreshTokenRemainingTime < 24 * 60 * 60 * 1000) { // 24시간 이하로 남았을 경우
			newRefreshToken = jwtTokenProvider.createRefreshToken(userId); // 새로운 Refresh Token 발급
			user.get().setRefreshToken(newRefreshToken); // DB 업데이트
			userRepository.save(user.get());
		}

		// 7️⃣ 새로운 Refresh Token 쿠키 설정
		ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", newRefreshToken)
			.httpOnly(true)
			.secure(true)
			.path("/")
			.maxAge(7 * 24 * 60 * 60) // 7일
			.build();

		// 8️⃣ 새로운 Access Token 쿠키 설정
		ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", newAccessToken)
			.httpOnly(true)
			.secure(true)
			.path("/")
			.maxAge(30 * 60)
			.build();

		return ResponseEntity.ok()
			.header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
			.header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
			.body(new ApiResponse("AccessToken 재발급이 성공적으로 완료되었습니다.", null));
	}
}
