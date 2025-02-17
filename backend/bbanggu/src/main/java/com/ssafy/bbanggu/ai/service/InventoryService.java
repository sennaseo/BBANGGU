package com.ssafy.bbanggu.ai.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.ssafy.bbanggu.bread.BreadDTO;
import com.ssafy.bbanggu.bread.BreadService;
import com.ssafy.bbanggu.stock.StockDTO;
import com.ssafy.bbanggu.stock.StockService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryService {

	private final ChatClient chatClient;
	private final BreadService breadService;
	private final StockService stockService;

	public String getResponse(long bakeryId) {
		// 지난 3개월 재고 조회
		List<StockDTO> stocks = stockService.getStockByPeriod(LocalDate.now().minusMonths(3), LocalDate.now(),
			bakeryId);

		// 재고 정보 전처리(breadId, quantity, date만 남김. 예: 5 2 250101)
		String stockInfo = convertStocksToString(stocks);

		// 가게 빵 정보 조회
		List<BreadDTO> breads = breadService.getBreadByBakeryId(bakeryId);

		// 가게 빵 정보 전처리
		String breadInfo = convertBreadsToString(breads);

		// 프롬프트
		String prompt = "너는 빵집의 재고를 분석하고 구체적인 수치 기반의 조언을 제공하는 AI 시스템이다.\n"
			+ "\n"
			+ "입력 데이터 형식:\n"
			+ "1. 가게 빵 정보: 'breadId name, breadId name' 형식\n"
			+ "예시) '1 소금빵, 2 크림빵, 3 단팥빵'\n"
			+ "\n"
			+ "2. 재고 정보: 'breadId quantity date' 형식\n"
			+ "예시) '1 20 240215, 2 15 240215, 1 18 240216'\n"
			+ "\n"
			+ "분석 요구사항:\n"
			+ "1. 각 빵의 현재 재고량과 비율 계산\n"
			+ "2. 날짜별 데이터 기반으로 재고 추이 예측\n"
			+ "3. 추가 생산 필요성 판단\n"
			+ "\n"
			+ "답변 형식:\n"
			+ "[개별 빵 분석]\n"
			+ "{빵이름} 재고 비율 {n}%, 현재 재고 {n}개\n"
			+ "→ 예측 재고 {n}개로 {증가/감소} 예상, {구체적인 조치사항}\n"
			+ "\n"
			+ "[전체 재고 분석]\n"
			+ "전체 재고 {n}% {증가/감소} 필요\n"
			+ "(현재 {n}개 → {n}개 이상 유지 필요)\n"
			+ "\n"
			+ "주의사항:\n"
			+ "1. 모든 수치는 구체적인 숫자로 표시 (예: 20%, 15개)\n"
			+ "2. 각 분석에는 구체적인 수치 포함\n"
			+ "3. breadId는 반드시 해당하는 빵 이름으로 변환\n"
			+ "4. 답변은 간단명료하게 작성\n"
			+ "5. 데이터가 부족한 경우 '데이터 부족으로 분석 불가' 메시지 출력하지 않기\n"
			+ "6. 반드시 한국어로 답변\n";

		return chatClient.prompt()
			.system(prompt)
			.user("가게 빵 정보: " + breadInfo + "\n재고 정보: " + stockInfo)
			.call()
			.content();
	}

	private String convertBreadsToString(List<BreadDTO> breads) {
		if (breads == null || breads.isEmpty()) {
			return "";
		}

		StringBuilder result = new StringBuilder();
		boolean isFirst = true;

		for (BreadDTO bread : breads) {
			if (!isFirst) {
				result.append(" ");
			}
			result.append(bread.getBreadId())
				.append(" ")
				.append(bread.getName());

			if (!isFirst || breads.size() > 1) {
				result.append(",");
			}
			isFirst = false;
		}

		return result.toString();
	}

	private String convertStocksToString(List<StockDTO> stocks) {
		if (stocks == null || stocks.isEmpty()) {
			return "";
		}

		StringBuilder result = new StringBuilder();
		boolean isFirst = true;

		for (StockDTO stock : stocks) {
			if (!isFirst) {
				result.append(", ");
			}

			// breadId와 quantity는 그대로 사용
			result.append(stock.getBreadId())
				.append(" ")
				.append(stock.getQuantity())
				.append(" ");

			// LocalDate를 원하는 형식(YYMMDD)으로 변환
			LocalDate date = stock.getDate();
			String formattedDate = String.format("%02d%02d%02d",
				date.getYear() % 100,  // 년도의 마지막 2자리
				date.getMonthValue(),  // 월
				date.getDayOfMonth()); // 일

			result.append(formattedDate);
			isFirst = false;
		}

		return result.toString();
	}

}
