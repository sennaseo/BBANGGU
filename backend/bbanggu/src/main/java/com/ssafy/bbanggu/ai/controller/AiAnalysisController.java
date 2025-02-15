package com.ssafy.bbanggu.ai.controller;

import com.ssafy.bbanggu.ai.service.OpenAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AI 분석 결과 반환
 */
@RestController
@RequestMapping("/api/ai")
public class AiAnalysisController {
	private final OpenAiService openAiService;

	public AiAnalysisController(OpenAiService openAiService) {
		this.openAiService = openAiService;
	}

	@PostMapping("/inventory-analysis")
	public ResponseEntity<Map<String, String>> analyzeInventory(@RequestBody Map<String, String> request) {
		String inventoryData = request.get("inventoryData");
		String analysisResult = openAiService.getInventoryAnalysis(inventoryData);
		return ResponseEntity.ok(Map.of("analysis", analysisResult));
	}
}
