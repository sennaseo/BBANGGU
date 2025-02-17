package com.ssafy.bbanggu.ai.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.ssafy.bbanggu.bread.BreadDTO;
import com.ssafy.bbanggu.bread.BreadService;
import com.ssafy.bbanggu.stock.StockDTO;
import com.ssafy.bbanggu.stock.StockService;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
			+ "1. 가게 빵 정보: 'breadId name' 형식으로 제공됨\n"
			+ "   예시: '1 소금빵, 2 크림빵'\n"
			+ "2. 재고 정보: 'breadId quantity YYMMDD' 형식으로 제공됨\n"
			+ "   예시: '1 10 240215, 1 8 240216, 2 15 240215'\n"
			+ "\n"
			+ "분석 방법:\n"
			+ "1. 빵별 현재 재고와 재고 비율 계산\n"
			+ "2. 최근 데이터 기반으로 예측 재고 계산\n"
			+ "3. 전체 재고 상황 분석\n"
			+ "\n"
			+ "출력 규칙:\n"
			+ "1. 정확히 3줄의 텍스트로 출력\n"
			+ "2. 첫째 줄: 가장 중요한 빵의 현재 상황\n"
			+ "   형식: {빵이름} 재고 비율 {n}%, 현재 재고 {n}개\n"
			+ "   → 예측 재고 {n}개로 감소 예상, {조치사항}\n"
			+ "3. 둘째 줄: 두 번째로 중요한 빵의 상황\n"
			+ "   형식: {빵이름} 예상 재고 {n}개로 감소 예상,\n"
			+ "   {조치사항}\n"
			+ "4. 셋째 줄: 전체 재고 현황\n"
			+ "   형식: {시점} 대비 전체 재고 {n}% 추가 확보 권장\n"
			+ "   (현재 {n}개 → {n}개 이상 유지 필요)\n"
			+ "\n"
			+ "주의사항:\n"
			+ "1. '현재상황', '개선방안' 같은 제목을 출력하지 말 것\n"
			+ "2. 모든 수치는 구체적인 숫자로 표현할 것\n"
			+ "3. breadId는 반드시 해당하는 빵 이름으로 변환할 것\n"
			+ "4. 각 줄은 예시 형식을 정확히 따를 것\n"
			+ "5. 데이터 부족 등의 오류 메시지를 출력하지 말 것";

		String response =  chatClient.prompt()
			.system(prompt)
			.user("가게 빵 정보: " + breadInfo + "\n재고 정보: " + stockInfo)
			.call()
			.content();

		return convertDateFormat(response);
	}

	/**
	 * GPT 응답에서 YYMMDD 형식을 'YY년 MM월 DD일' 형식으로 변환하는 메서드
	 */
	private String convertDateFormat(String response) {
		Pattern pattern = Pattern.compile("\\b(\\d{2})(\\d{2})(\\d{2})\\b"); // YYMMDD 패턴 찾기
		Matcher matcher = pattern.matcher(response);
		StringBuffer sb = new StringBuffer();

		while (matcher.find()) {
			String year = "20" + matcher.group(1); // '25' → '2025'
			String month = matcher.group(2); // '02'
			String day = matcher.group(3); // '04'
			String formattedDate = String.format("%s년 %s월 %s일", year, month, day); // 변환된 형식

			matcher.appendReplacement(sb, formattedDate);
		}
		matcher.appendTail(sb);

		return sb.toString();
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
