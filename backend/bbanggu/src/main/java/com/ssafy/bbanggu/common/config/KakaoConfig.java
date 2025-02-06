package com.ssafy.bbanggu.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Component
@ConfigurationProperties(prefix = "kakao")
@Getter
@Setter
public class KakaoConfig {
	private String clientId;
	private String redirectUri;
	private String authUri;
	private String tokenUri;
	private String userInfoUri;
}

