package com.ssafy.bbanggu.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bbanggu.ai.dto.InventoryRequestDto;
import com.ssafy.bbanggu.ai.dto.InventoryResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InventoryService {

	private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

	@Value("${openai.api-key}")
	private String OPENAI_API_KEY;

	private final RestTemplate restTemplate;
	private final ObjectMapper objectMapper = new ObjectMapper();

	public InventoryResponseDto analyzeInventory(InventoryRequestDto requestDto) {
		try {
			// 프롬프트 생성
			String prompt = generatePrompt(requestDto);

			// OpenAI API 요청 데이터 구성
			Map<String, Object> requestBody = new HashMap<>();
			requestBody.put("model", "gpt-4");
			requestBody.put("messages", new Object[]{
				Map.of("role", "system", "content", "You are an AI inventory analyst."),
				Map.of("role", "user", "content", prompt)
			});
			requestBody.put("temperature", 0.7);

			// JSON 변환
			String jsonRequest = objectMapper.writeValueAsString(requestBody);

			// HTTP 요청 엔티티 생성
			HttpEntity<String> requestEntity = createRequestEntity(jsonRequest);

			// OpenAI API 호출
			ResponseEntity<String> response = restTemplate.exchange(
				OPENAI_API_URL,
				HttpMethod.POST,
				requestEntity,
				String.class
			);

			// OpenAI 응답에서 `content`만 추출
			String analysisResult = extractContent(response.getBody());

			// 응답 반환
			return InventoryResponseDto.builder()
				.message("AI 분석 완료!")
				.analysis(analysisResult)
				.build();
		} catch (Exception e) {
			throw new RuntimeException("AI 분석 요청 중 오류 발생: " + e.getMessage());
		}
	}

	private String generatePrompt(InventoryRequestDto requestDto) {
		StringBuilder prompt = new StringBuilder("Analyze the following store inventory and provide recommendations:\n");
		prompt.append("Store Name: ").append(requestDto.getStoreName()).append("\n");

		for (var item : requestDto.getItems()) {
			prompt.append("Item: ").append(item.getItemName())
				.append(", Quantity: ").append(item.getQuantity())
				.append(", Sales: ").append(item.getSales()).append("\n");
		}

		return prompt.toString();
	}

	private HttpEntity<String> createRequestEntity(String body) {
		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", "Bearer " + OPENAI_API_KEY);
		headers.set("Content-Type", "application/json");
		return new HttpEntity<>(body, headers);
	}

	/**
	 * OpenAI API 응답에서 `choices[0].message.content`만 추출
	 */
	private String extractContent(String jsonResponse) {
		try {
			JsonNode rootNode = objectMapper.readTree(jsonResponse);
			return rootNode.path("choices").get(0).path("message").path("content").asText();
		} catch (Exception e) {
			return "AI 응답 데이터 처리 중 오류 발생: " + e.getMessage();
		}
	}
}
