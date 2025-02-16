package com.ssafy.bbanggu.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAI API Key 설정
 * : GPT API 키를 블러오고, HTTP 요청을 보낼 RestTemplate 설정
 */
@Configuration
public class OpenAiConfig {

	@Value("${openai.api-key}")
	private String openAiApiKey;

	public String getOpenAiApiKey() {
		return openAiApiKey;
	}
}
