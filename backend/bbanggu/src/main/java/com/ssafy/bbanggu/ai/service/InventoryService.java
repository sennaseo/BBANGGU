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
			+ "입력 데이터:\n"
			+ "\n"
			+ "가게 빵 정보(breadIdList): {breadId:name, breadId:name, ...}\n"
			+ "재고 정보(stocks): {breadId quantity date, breadId quantity date, ...}\n"
			+ "출력 규칙:\n"
			+ "\n"
			+ "추세 분석:\n"
			+ "\n"
			+ "breadId별 quantity 추세(증가/감소)를 분석하라.\n"
			+ "다른 breadId보다 추세 변화가 두드러지면 아래와 같이 출력하라.\n"
			+ "✅ {breadId}가 {date}부터 [증가/감소]하는 추세입니다.\n"
			+ "재고 부족:\n"
			+ "\n"

			+ "breadId의 quantity 총합이 0이거나 현저히 낮으면 출력하라.\n"
			+ "✅ {breadId}는 재고가 거의 남지 않는 것으로 보입니다.\n"
			+ "재고 과잉:\n"
			+ "\n"
			+ "breadId의 quantity 총합이 다른 breadId보다 현저히 높으면 출력하라.\n"
			+ "✅ {breadId}는 재고가 다른 빵에 비해 많이 남습니다.\n"
			+ "개선 방안:\n"
			+ "\n"
			+ "1번 응답이 있다면:\n"
			+ "✅ {breadId}의 생산량을 {n}%({n}개) [줄이세요/늘리세요].\n"
			+ "2번 응답이 있다면:\n"
			+ "✅ {breadId}는 거의 남지 않습니다. 생산량을 늘려보세요.\n"
			+ "3번 응답이 있다면:\n"
			+ "✅ {breadId}는 다른 빵에 비해 많이 남습니다. 생산량을 줄여보세요.\n"
			+ "모든 최종 출력에서 {breadId}는 breadIdList의 name으로 변경하라.\n"
			+ "\n"
			+ "최종 출력 형식:\n"
			+ "현재상황\n"
			+ "{1, 2, 3번 분석 결과}\n"
			+ "\n"
			+ "개선방안\n"
			+ "{4번 개선 방안}";

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
