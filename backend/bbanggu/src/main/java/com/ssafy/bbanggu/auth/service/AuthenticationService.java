package com.ssafy.bbanggu.auth.service;

import org.springframework.stereotype.Service;

import com.ssafy.bbanggu.auth.security.JwtTokenProvider;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
	private final UserRepository userRepository;
	private final JwtTokenProvider jwtTokenProvider;

	// ✅ Refresh Token 재발급 (Access Token 새로 생성)
	public String[] reissueAccessToken(String refreshToken) {
		// 1️⃣ Refresh Token 검증
		if (!jwtTokenProvider.validateToken(refreshToken)) {
			throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
		}

		// 2️⃣ Refresh Token에서 이메일 추출
		Long userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// 3️⃣ DB에 저장된 Refresh Token과 비교
		if (!refreshToken.equals(user.getRefreshToken())) {
			throw new CustomException(ErrorCode.TOKEN_THEFT_DETECTED);
		}

		String[] tokens = new String[2]; // access, refresh token을 담아줄 배열 생성

		// 4️⃣ Refresh Token 사용 후 즉시 폐기 (보안 강화)
		String newRefreshToken = jwtTokenProvider.createRefreshToken(userId);
		user.setRefreshToken(newRefreshToken);
		userRepository.save(user);
		tokens[0] = newRefreshToken;

		// 5️⃣ 새로운 AccessToken 발급
		String newAccessToken = jwtTokenProvider.createAccessToken(userId);
		tokens[1] = newAccessToken;

		return tokens;
	}
}
