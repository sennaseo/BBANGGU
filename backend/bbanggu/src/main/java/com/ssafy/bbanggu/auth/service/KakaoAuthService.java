package com.ssafy.bbanggu.auth.service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import com.ssafy.bbanggu.auth.dto.KakaoUserInfo;
import com.ssafy.bbanggu.common.util.JwtUtil;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KakaoAuthService {

	private final UserRepository userRepository;
	private final JwtUtil jwtUtil;
	private final KakaoOAuth2 kakaoOAuth2;

	@Value("${kakao.client-id}")
	private String kakaoClientId;

	@Value("${kakao.redirect-uri}")
	private String kakaoRedirectUri;

	private static final String KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";

	/**
	 * 🔹 카카오 로그인 URL 생성
	 */
	public String getKakaoLoginUrl() {
		return KAKAO_AUTH_URL
			+ "?client_id=" + kakaoClientId
			+ "&redirect_uri=" + kakaoRedirectUri
			+ "&response_type=code"
			+ "&prompt=login";  // 🔹 로그인 창 강제 표시
	}

	/**
	 * 🔹 카카오 로그인 처리 (인증 코드 -> 사용자 정보 조회 -> JWT 발급)
	 */
	public Map<String, String> kakaoLogin(String authCode) {
		KakaoUserInfo kakaoUserInfo = kakaoOAuth2.getUserInfo(authCode);
		System.out.println("카카오 사용자 정보: " + kakaoUserInfo);

		String kakaoId = kakaoUserInfo.kakaoId();
		String email = kakaoUserInfo.email();
		String nickname = kakaoUserInfo.nickname();

		// 🔹 기존 사용자 확인 (kakao_id 기준)
		Optional<User> existingUser = userRepository.findByKakaoId(kakaoId);

		if (existingUser.isEmpty() && email != null && !email.isBlank()) {
			existingUser = userRepository.findByEmail(email);
		}

		User user;
		if (existingUser.isPresent()) {
			user = existingUser.get();
			System.out.println("기존 회원 로그인: " + user.getEmail());
		} else {
			// 🔹 신규 카카오 회원 생성
			user = User.createKakaoUser(kakaoId, nickname);
			userRepository.save(user);
			System.out.println("신규 회원 가입: " + user.getEmail());
		}

		// JWT 토큰 발급
		String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getUserId());
		String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

		user.setRefreshToken(refreshToken);
		userRepository.save(user);
		System.out.println("JWT Access Token 발급: " + accessToken);

		return Map.of(
			"message", "Login successful",
			"access_token", accessToken,
			"refresh_token", refreshToken
		);
	}
}
