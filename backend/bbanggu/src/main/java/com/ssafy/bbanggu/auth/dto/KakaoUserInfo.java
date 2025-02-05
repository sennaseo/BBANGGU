package com.ssafy.bbanggu.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 카카오 사용자 정보 DTO
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class KakaoUserInfo {
	private String kakaoId;
	private String email;
	private String nickname;
	private String profileImage;
}

