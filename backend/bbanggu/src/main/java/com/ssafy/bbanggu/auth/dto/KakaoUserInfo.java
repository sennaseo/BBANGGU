package com.ssafy.bbanggu.auth.dto;

/**
 * 카카오 사용자 정보 DTO
 */
public record KakaoUserInfo(String kakaoId, String nickname, String email) {
	public KakaoUserInfo(String kakaoId, String nickname, String email) {
		this.kakaoId = kakaoId;
		this.nickname = nickname;
		this.email = (email == null || email.isBlank()) ? "kakao_" + kakaoId + "@bbanggu.com" : email;
	}
}
