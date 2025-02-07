package com.ssafy.bbanggu.payment;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PaymentService {
	@Value("${toss.payments.api-key}")
	private String tossApiKey;

	public void check(String orderId, String paymentKey, int amount) {
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.setBasicAuth(tossApiKey, "");
		Map<String, Object> requestBody = new HashMap<>();
		requestBody.put("amount", amount);
		requestBody.put("orderId", orderId);
		requestBody.put("paymentKey", paymentKey);

		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
		ResponseEntity<TossPaymentResponseDto> response = restTemplate.exchange(
			"https://api.tosspayments.com/v1/payments/confirm",
			HttpMethod.POST, entity, TossPaymentResponseDto.class);


	}
}
