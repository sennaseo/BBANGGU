package com.ssafy.bbanggu.auth.controller;

import com.ssafy.bbanggu.auth.security.AuthCookieFactory;
import com.ssafy.bbanggu.auth.security.JwtTokenProvider;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
	private final JwtTokenProvider jwtTokenProvider;
	private final UserRepository userRepository;
	private final AuthCookieFactory cookieFactory;

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
		if (!jwtTokenProvider.validateRefreshToken(refreshToken)) {
			throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
		}

		// 3️⃣ refresh token에서 사용자 정보 추출
		Long userId = jwtTokenProvider.getUserIdFromRefreshToken(refreshToken);

		// 4️⃣ 사용자 조회 (DB에서 refresh token 일치 여부 확인)
		Optional<User> user = userRepository.findById(userId);
		if (user.isEmpty() || !refreshToken.equals(user.get().getRefreshToken())) {
			throw new CustomException(ErrorCode.NOT_MATCHED_AUTH_INFO);
		}

		// 5️⃣ 새로운 Access Token 생성
		Map<String, Object> additionalClaims = Map.of(
			"role", user.get().getRole().name()
		);
		String newAccessToken = jwtTokenProvider.createAccessToken(userId, additionalClaims);
		String newRefreshToken = refreshToken;

		// 6️⃣ Sliding Refresh 적용 (Refresh Token이 24시간 이하로 남았을 때만 새로 발급)
		long refreshTokenRemainingTime = jwtTokenProvider.getRemainingExpirationTime(refreshToken, false); // 남은 만료 시간

		if (refreshTokenRemainingTime < 24 * 60 * 60 * 1000) { // 24시간 이하로 남았을 경우
			newRefreshToken = jwtTokenProvider.createRefreshToken(userId); // 새로운 Refresh Token 발급
			user.get().setRefreshToken(newRefreshToken); // DB 업데이트
			userRepository.save(user.get());
		}

		// 7️⃣ 8️⃣ 새로운 토큰 쿠키 설정 (secure 분기·path 제한은 팩토리가 관리)
		ResponseCookie refreshTokenCookie = cookieFactory.refreshToken(newRefreshToken);
		ResponseCookie accessTokenCookie = cookieFactory.accessToken(newAccessToken);

		// 프론트가 Authorization 헤더 방식으로 access token을 쓰므로 body에도 담아준다
		// (쿠키만 내리면 JS가 httpOnly 토큰을 못 읽어 헤더에 붙일 수 없음)
		Map<String, Object> responseData = Map.of(
			"access_token", newAccessToken,
			"user_type", user.get().getRole().name()
		);

		return ResponseEntity.ok()
			.header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
			.header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
			.body(new ApiResponse("AccessToken 재발급이 성공적으로 완료되었습니다.", responseData));
	}
}
