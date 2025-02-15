package com.ssafy.bbanggu.ai.service;

import com.ssafy.bbanggu.common.config.OpenAiConfig;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * GPT API 호출
 */
@Service
public class OpenAiService {
	private final RestTemplate restTemplate;
	private final OpenAiConfig openAiConfig;
	private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

	public OpenAiService(RestTemplate restTemplate, OpenAiConfig openAiConfig) {
		this.restTemplate = restTemplate;
		this.openAiConfig = openAiConfig;
	}

	public String getInventoryAnalysis(String inventoryData) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.setBearerAuth(openAiConfig.getOpenAiApiKey());

		Map<String, Object> requestBody = Map.of(
			"model", "gpt-3.5-turbo",
			"messages", List.of(
				Map.of("role", "system", "content", "You are an AI assistant helping bakery owners analyze their inventory."),
				Map.of("role", "user", "content", inventoryData)
			)
		);

		HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
		ResponseEntity<Map> response = restTemplate.exchange(OPENAI_URL, HttpMethod.POST, requestEntity, Map.class);

		// OpenAI 응답에서 "choices" 안의 "message.content"만 추출
		List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
		Map<String, Object> firstChoice = choices.get(0);
		Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");

		return message.get("content").toString();  // 텍스트만 반환!
	}
}
