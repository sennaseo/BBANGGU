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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

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
	 * @return [위도, 경도] 배열 (실패 시 [0.0, 0.0] 반환)
	 */
	public double[] getLatLngFromAddress(String address) {
		try {
			String url = KAKAO_API_URL + "?query=" + address;

			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", "KakaoAK " + KAKAO_API_KEY);

			HttpEntity<String> entity = new HttpEntity<>(headers);
			ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

			System.out.println("🛰️ Kakao API 응답: " + response.getBody()); // 응답 로그 확인

			JSONObject jsonResponse = new JSONObject(response.getBody());
			JSONArray documents = jsonResponse.getJSONArray("documents");

			if (documents.length() > 0) {
				JSONObject location = documents.getJSONObject(0);
				double lat = location.getDouble("y");
				double lng = location.getDouble("x");
				System.out.println("🛰️ 변환된 위도: " + lat + ", 경도: " + lng);
				return new double[]{lat, lng};
			} else {
				System.err.println("❌ 주소 검색 실패, 지번 주소로 재검색 시도...");
				return getLatLngFromJibunAddress(address); // 🔥 지번 주소로 재검색!
			}
		} catch (Exception e) {
			System.err.println("❌ 위경도 변환 중 오류 발생: " + e.getMessage());
			return new double[]{0.0, 0.0};
		}
	}

	// 🔥 지번 주소로 재검색
	private double[] getLatLngFromJibunAddress(String address) {
		try {
			String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8);
			String url = KAKAO_API_URL + "?query=" + encodedAddress;

			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", "KakaoAK " + KAKAO_API_KEY);

			HttpEntity<String> entity = new HttpEntity<>(headers);
			ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

			System.out.println("🛰️ Kakao API 응답(지번주소): " + response.getBody());

			JSONObject jsonResponse = new JSONObject(response.getBody());
			JSONArray documents = jsonResponse.getJSONArray("documents");

			if (documents.length() > 0) {
				JSONObject location = documents.getJSONObject(0);
				double lat = location.getDouble("y");
				double lng = location.getDouble("x");
				System.out.println("🛰️ 변환된 위도(지번): " + lat + ", 경도(지번): " + lng);
				return new double[]{lat, lng};
			} else {
				System.err.println("❌ 지번 주소도 검색 실패...");
				return new double[]{0.0, 0.0};
			}
		} catch (Exception e) {
			System.err.println("❌ 지번 주소 변환 중 오류 발생: " + e.getMessage());
			return new double[]{0.0, 0.0};
		}
	}

}

