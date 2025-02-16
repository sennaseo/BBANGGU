package com.ssafy.bbanggu.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bbanggu.auth.dto.KakaoUserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Service
@RequiredArgsConstructor
public class KakaoOAuth2 {

	@Value("${kakao.client-id}")
	private String kakaoClientId;

	@Value("${kakao.redirect-uri}")
	private String kakaoRedirectUri;

	@Value("${kakao.api-url.token}")
	private String kakaoTokenUrl;

	@Value("${kakao.api-url.user-info}")
	private String kakaoUserInfoUrl;

	private final RestTemplate restTemplate = new RestTemplate();
	private final ObjectMapper objectMapper = new ObjectMapper();

	/**
	 * 카카오 로그인 후 사용자 정보 가져오기
	 */
	public KakaoUserInfo getUserInfo(String authCode) {
		// 1️⃣ 카카오로부터 Access Token 요청
		String accessToken = getAccessToken(authCode);

		// 2️⃣ 카카오로부터 사용자 정보 요청
		return fetchUserInfo(accessToken);
	}

	/**
	 * 🔹 카카오 Access Token 요청
	 */
	// 카카오 OAuth 서버에 Access Token 요청
	private String getAccessToken(String authCode) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
		body.add("grant_type", "authorization_code");
		body.add("client_id", kakaoClientId);
		body.add("redirect_uri", kakaoRedirectUri);
		body.add("code", authCode);

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
		ResponseEntity<String> response = restTemplate.exchange(kakaoTokenUrl, HttpMethod.POST, request, String.class);

		try {
			JsonNode jsonNode = objectMapper.readTree(response.getBody());
			System.out.println("카카오 Access Token 응답: " + response.getBody());
			return jsonNode.get("access_token").asText();
		} catch (Exception e) {
			throw new RuntimeException("Failed to get Kakao access token", e);
		}
	}

	/**
	 * 카카오 OAuth 서버에서 사용자 정보 가져오기
	 */
	private KakaoUserInfo fetchUserInfo(String accessToken) {
		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(accessToken);

		HttpEntity<String> request = new HttpEntity<>(headers);
		ResponseEntity<String> response = restTemplate.exchange(
			"https://kapi.kakao.com/v2/user/me", HttpMethod.GET, request, String.class
		);

		try {
			JsonNode jsonNode = objectMapper.readTree(response.getBody());
			System.out.println("카카오 사용자 정보 응답: " + response.getBody());

			String kakaoId = jsonNode.get("id").asText();
			String nickname = jsonNode.path("properties").path("nickname").asText();
			String email = jsonNode.path("kakao_account").path("email").asText();
			String profileImage = jsonNode.path("properties").path("profile_image").asText();

			return new KakaoUserInfo(kakaoId, nickname, email, profileImage);
		} catch (Exception e) {
			throw new RuntimeException("Failed to fetch Kakao user info", e);
		}
	}
}
