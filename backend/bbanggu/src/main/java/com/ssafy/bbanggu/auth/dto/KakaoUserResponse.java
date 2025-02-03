package com.ssafy.bbanggu.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class KakaoUserResponse {
	@JsonProperty("id")
	private Long id;

	@JsonProperty("properties")
	private KakaoProperties properties;

	@Getter
	public static class KakaoProperties {
		@JsonProperty("nickname")
		private String nickname;

		@JsonProperty("profile_image")
		private String profileImage;
	}
}
