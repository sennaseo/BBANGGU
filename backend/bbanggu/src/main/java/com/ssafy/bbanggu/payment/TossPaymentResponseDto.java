package com.ssafy.bbanggu.payment;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class TossPaymentResponseDto {
	@JsonProperty("mId")
	private String merchantId;

	@JsonProperty("lastTransactionKey")
	private String lastTransactionKey;

	@JsonProperty("paymentKey")
	private String paymentKey;

	@JsonProperty("orderId")
	private String orderId;

	@JsonProperty("orderName")
	private String orderName;

	@JsonProperty("taxExemptionAmount")
	private int taxExemptionAmount;

	@JsonProperty("status")
	private String status;

	@JsonProperty("requestedAt")
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime requestedAt;

	@JsonProperty("approvedAt")
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime approvedAt;

	@JsonProperty("useEscrow")
	private boolean useEscrow;

	@JsonProperty("totalAmount")
	private int totalAmount;

	@JsonProperty("balanceAmount")
	private int balanceAmount;

	@JsonProperty("method")
	private String paymentMethod;

	@JsonProperty("receipt")
	private Receipt receipt;

	@JsonProperty("easyPay")
	private EasyPay easyPay;

	@JsonProperty("currency")
	private String currency;

	@JsonProperty("isPartialCancelable")
	private boolean isPartialCancelable;

	@JsonIgnoreProperties(ignoreUnknown = true)
	@Getter
	@Setter
	public static class Receipt {
		@JsonProperty("url")
		private String url;
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	@Getter
	@Setter
	public static class EasyPay {
		@JsonProperty("provider")
		private String provider;

		@JsonProperty("amount")
		private int amount;

		@JsonProperty("discountAmount")
		private int discountAmount;
	}
}
