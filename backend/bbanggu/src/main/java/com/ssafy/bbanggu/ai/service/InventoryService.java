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
		String prompt = "너는 빵집 재고 분석 AI이다. 반드시 한국어로 답변하라.\n"
			+ "\n"
			+ "입력 데이터 형식 설명:\n"
			+ "1. 가게 빵 정보는 'breadId name' 형식으로 제공됨\n"
			+ "   예시: '1 소금빵, 2 크림빵'\n"
			+ "2. 재고 정보는 'breadId quantity YYMMDD' 형식으로 제공됨\n"
			+ "   예시: '1 10 240215, 1 8 240216, 2 15 240215'\n"
			+ "\n"
			+ "분석 방법:\n"
			+ "1. 각 빵의 재고 추세 확인\n"
			+ "   - 최근 날짜 기준으로 재고량 변화 확인\n"
			+ "   - 급격한 증가/감소 패턴 파악\n"
			+ "2. 재고 상태 판단\n"
			+ "   - 재고 부족: quantity가 5개 이하\n"
			+ "   - 재고 과잉: quantity가 20개 이상\n"
			+ "\n"
			+ "출력 형식:\n"
			+ "\n"
			+ "현재상황\n"
			+ "✅ {빵이름}이(가) {날짜}부터 [증가/감소]하는 추세입니다.\n"
			+ "✅ {빵이름}은(는) 재고가 거의 남지 않는 것으로 보입니다.\n"
			+ "✅ {빵이름}은(는) 재고가 다른 빵에 비해 많이 남습니다.\n"
			+ "\n"
			+ "개선방안\n"
			+ "✅ {빵이름}의 생산량을 {숫자}%({숫자}개) [줄이세요/늘리세요].\n"
			+ "✅ {빵이름}은(는) 거의 남지 않습니다. 생산량을 늘려보세요.\n"
			+ "✅ {빵이름}은(는) 다른 빵에 비해 많이 남습니다. 생산량을 줄여보세요.\n"
			+ "\n"
			+ "규칙:\n"
			+ "1. breadId는 반드시 해당하는 빵 이름으로 변환하여 출력\n"
			+ "2. 데이터 부족 메시지를 출력하지 말 것\n"
			+ "3. 모든 수치는 구체적인 숫자로 표현할 것 (예: 20%, 15개)\n"
			+ "4. 결과가 없더라도 오류 메시지를 출력하지 말고 빈 결과 반환\n"
			+ "5. 빵 이름과 breadId 매칭이 안 된다는 메시지를 출력하지 말 것\n"
			+ "6. 분석 불가 메시지를 출력하지 말 것";

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
