package com.ssafy.bbanggu.auth.service;

import org.springframework.stereotype.Service;

import com.ssafy.bbanggu.auth.security.JwtUtil;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
	private final UserRepository userRepository;
	private final JwtUtil jwtUtil;

	/**
	 * Access Token 재발급
	 *
	 * @param refreshToken 클라이언트에서 전달받은 Refresh Token
	 * @return 새로운 Access Token
	 */
	public String refreshAccessToken(String refreshToken) {
		// 1️⃣ Refresh Token 유효성 검증
		if (!jwtUtil.validateToken(refreshToken)) {
			throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
		}

		// 2️⃣ Refresh Token에서 이메일 추출
		String email = jwtUtil.getEmailFromToken(refreshToken);
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// 3️⃣ DB에 저장된 Refresh Token과 비교
		if (!refreshToken.equals(user.getRefreshToken())) {
			throw new CustomException(ErrorCode.TOKEN_THEFT_DETECTED);
		}

		// 4️⃣ Refresh Token 사용 후 즉시 폐기 (보안 강화)
		String newRefreshToken = jwtUtil.generateRefreshToken(email);
		user.setRefreshToken(newRefreshToken);
		userRepository.save(user);

		// 5️⃣ 새로운 AccessToken 발급
		return jwtUtil.generateAccessToken(email, user.getUserId());
	}
}
