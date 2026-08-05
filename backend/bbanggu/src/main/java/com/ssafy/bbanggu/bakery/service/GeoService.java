package com.ssafy.bbanggu.bakery.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;

@Service
public class GeoService {
	@Value("${kakao.api.url}")
	private String KAKAO_API_URL;

	@Value("${kakao.api.key}")
	private String KAKAO_API_KEY;

	private final RestTemplate restTemplate = new RestTemplate();

	/**
	 * 주어진 주소를 기반으로 위도와 경도를 가져오는 메서드
	 * @param address 변환할 주소
	 * @return [위도, 경도] 배열
	 * @throws CustomException 지오코딩 실패 시 (예전엔 [0,0]을 반환해 바다 위에 가게가 찍혔음)
	 */
	public double[] getLatLngFromAddress(String address) {
		try {
			String url = KAKAO_API_URL + "?query=" + address;

			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", "KakaoAK " + KAKAO_API_KEY);

			HttpEntity<String> entity = new HttpEntity<>(headers);
			ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

			JSONObject jsonResponse = new JSONObject(response.getBody());
			JSONArray documents = jsonResponse.getJSONArray("documents");

			JSONObject location = documents.getJSONObject(0);
			double lat = location.getDouble("y");
			double lng = location.getDouble("x");

			return new double[] {lat, lng};
		} catch (Exception e) {
			throw new CustomException(ErrorCode.ADDRESS_GEOCODING_FAILED);
		}
	}
}
