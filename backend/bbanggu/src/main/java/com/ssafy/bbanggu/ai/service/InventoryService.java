package com.ssafy.bbanggu.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bbanggu.ai.dto.InventoryItemDto;
import com.ssafy.bbanggu.ai.dto.InventoryRequestDto;
import com.ssafy.bbanggu.ai.dto.InventoryResponseDto;
import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.bakery.domain.Bakery;
import com.ssafy.bbanggu.bakery.repository.BakeryRepository;
import com.ssafy.bbanggu.stock.StockRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InventoryService {

	private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

	@Value("${openai.api-key}")
	private String OPENAI_API_KEY;

	private final RestTemplate restTemplate;
	private final ObjectMapper objectMapper = new ObjectMapper();

	private final BakeryRepository bakeryRepository;
	private final StockRepository stockRepository;

	public InventoryResponseDto analyzeInventory(CustomUserDetails userDetails) {
		Bakery bakery = bakeryRepository.findByUser_UserId(userDetails.getUserId());
		InventoryRequestDto request = new InventoryRequestDto();
		request.setStoreName(bakery.getName());
		List<InventoryItemDto> items = stockRepository.findByBakery_BakeryId(bakery.getBakeryId());
		request.setItems(items);

		try {
			String prompt = generatePrompt(request);
			Map<String, Object> requestBody = new HashMap<>();
			requestBody.put("model", "gpt-4");
			requestBody.put("messages", new Object[]{
				Map.of("role", "system", "content",
					"당신은 빵집 재고를 분석하는 AI 전문가입니다. 빵집 운영에 대한 인사이트를 제공해주세요. " +
						"응답은 반드시 **한국어**로 작성하며, 아래 형식을 엄격히 따르세요:\n\n" +
						"✅ **현재 상황 분석**: 현재 재고를 분석한 결과를 간단히 설명해주세요.\n" +
						"✅ **개선이 필요한 부분**: 개선해야 할 문제점을 제시하세요.\n" +
						"✅ **구체적인 실행 방안**: 재고 예측 및 개선을 위한 구체적인 실행 전략을 제공하세요.\n\n"
				),
				Map.of("role", "user", "content", prompt)
			});
			requestBody.put("temperature", 0.7);

			String jsonRequest = objectMapper.writeValueAsString(requestBody);
			HttpEntity<String> requestEntity = createRequestEntity(jsonRequest);

			ResponseEntity<String> response = restTemplate.exchange(
				OPENAI_API_URL,
				HttpMethod.POST,
				requestEntity,
				String.class
			);

			String analysisResult = extractContent(response.getBody());

			return InventoryResponseDto.builder()
				.message("분석이 완료되었습니다!")
				.analysis(analysisResult)
				.build();
		} catch (Exception e) {
			throw new RuntimeException("AI 분석 중 오류가 발생했습니다: " + e.getMessage());
		}
	}

	private String generatePrompt(InventoryRequestDto requestDto) {
		StringBuilder prompt = new StringBuilder();
		prompt.append("다음 빵집의 재고 상황을 분석해주세요:\n\n");
		prompt.append("가게명: ").append(requestDto.getStoreName()).append("\n\n");
		prompt.append("제품 현황:\n");

		for (var item : requestDto.getItems()) {
			prompt.append("- ").append(item.getBreadId())
				.append("\n  재고량: ").append(item.getQuantity())
				//.append("\n  판매량: ").append(item.getSales())
				.append("\n");
		}

		prompt.append("\n실용적이고 구체적인 조언을 제공해주세요.");
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
