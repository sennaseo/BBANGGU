package com.ssafy.bbanggu.auth.service;

import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.ssafy.bbanggu.auth.dto.JwtToken;
import com.ssafy.bbanggu.auth.dto.KakaoTokenResponse;
import com.ssafy.bbanggu.auth.dto.KakaoUserInfo;
import com.ssafy.bbanggu.auth.security.JwtTokenProvider;
import com.ssafy.bbanggu.common.config.KakaoConfig;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

@Service
@RequiredArgsConstructor
public class KakaoAuthService {

	@Value("${kakao.api-url.user-info}")
	private String kakaoUserInfoUrl;
	@Value("${kakao.api-url.token}")
	private String kakaoTokenUrl;

	private final RestTemplate restTemplate;
	private final UserRepository userRepository;
	private final JwtTokenProvider jwtUtil;
	private final KakaoConfig kakaoConfig;

	/**
	 * ✅ 1. 카카오 로그인 URL 생성 (Redirect)
	 */
	public String getKakaoLoginUrl() {
		return kakaoConfig.getAuthUri() +
			"?client_id=" + kakaoConfig.getClientId() +
			"&redirect_uri=" + kakaoConfig.getRedirectUri() +
			"&response_type=code" +
			"&prompt=select_account"; // 간편 로그인
	}

	/**
	 * ✅ 2. Kakao 인증 코드 → Access Token 요청
	 */
	public String getKakaoAccessToken(String authCode) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", kakaoConfig.getClientId());
		params.add("redirect_uri", kakaoConfig.getRedirectUri());
		params.add("code", authCode);

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

		try {
			ResponseEntity<KakaoTokenResponse> response = restTemplate.postForEntity(kakaoTokenUrl, request, KakaoTokenResponse.class);
			return response.getBody().getAccessToken();
		} catch (Exception e) {
			throw new CustomException(ErrorCode.KAKAO_AUTH_FAILED);
		}
	}


	/**
	 * ✅ 3. Kakao Access Token → 사용자 정보 조회
	 */
	public KakaoUserInfo getKakaoUserInfo(String kakaoAccessToken) {
		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(kakaoAccessToken);
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		HttpEntity<?> entity = new HttpEntity<>(headers);

		try {
			ResponseEntity<JsonNode> response = restTemplate.exchange(kakaoUserInfoUrl, HttpMethod.GET, entity, JsonNode.class);
			JsonNode jsonNode = response.getBody();

			String kakaoId = jsonNode.get("id").asText();
			String nickname = jsonNode.path("properties").path("nickname").asText();
			String email = jsonNode.path("kakao_account").path("email").asText();
			String profileImage = jsonNode.path("properties").path("profile_image").asText();

			return new KakaoUserInfo(kakaoId, email, nickname, profileImage);
		} catch (HttpClientErrorException e) {
			throw new CustomException(ErrorCode.KAKAO_USER_INFO_FAILED);
		}
	}

	/**
	 * ✅ 4. 로그인 or 회원가입 처리 후 JWT 발급
	 */
	//@Transactional
	public JwtToken handleKakaoLogin(String authCode) {
		try {
			// ✅ 1. 카카오 토큰 요청
			String kakaoAccessToken = getKakaoAccessToken(authCode);

			// ✅ 2. 카카오 사용자 정보 요청
			KakaoUserInfo kakaoUserInfo = getKakaoUserInfo(kakaoAccessToken);
			System.out.println("✅ 카카오 사용자 정보: " + kakaoUserInfo);

			// ✅ 3. DB에서 사용자 조회 (`kakaoId` 기준으로 검증!)
			User user = userRepository.findByKakaoId(kakaoUserInfo.getKakaoId())
				.orElseGet(() -> {
					System.out.println("✅ 신규 카카오 사용자 회원가입: " + kakaoUserInfo.getEmail());
					return registerNewKakaoUser(kakaoUserInfo);
				});

			// ✅ 4. JWT 발급
			Map<String, Object> additionalClaims = Map.of(
				"role", user.getRole().name()
			);
			JwtToken jwtToken = new JwtToken(jwtUtil.createAccessToken(user.getUserId(), additionalClaims), jwtUtil.createRefreshToken(user.getUserId()));

			// ✅ 5. Refresh Token 저장 (즉시 반영)
			user.setRefreshToken(jwtToken.getRefreshToken());
			userRepository.saveAndFlush(user); // 🔥 즉시 DB 반영

			return jwtToken;

		} catch (Exception e) {
			System.err.println("❌ 카카오 로그인 중 오류 발생: " + e.getMessage());
			e.printStackTrace();
			throw new CustomException(ErrorCode.KAKAO_AUTH_FAILED);
		}
	}

	/**
	 * ✅ 5. Kakao 사용자 회원가입 (최초 로그인 시)
	 */
	private User registerNewKakaoUser(KakaoUserInfo userInfo) {
		// User 엔티티의 정적 메서드 활용 (가독성 & 유지보수성 향상)
		User newUser = User.createKakaoUser(userInfo.getKakaoId(), userInfo.getNickname());

		newUser.setProfileImageUrl(userInfo.getProfileImage()); // ✅ 프로필 이미지 설정

		return userRepository.save(newUser);
	}
}
