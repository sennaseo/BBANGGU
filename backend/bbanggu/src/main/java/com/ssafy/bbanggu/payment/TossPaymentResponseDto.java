package com.ssafy.bbanggu.payment;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true) // 불필요한 필드는 무시
public class TossPaymentResponseDto {
	private String mId;
	private String lastTransactionKey;
	private String paymentKey;
	private String orderId;
	private String orderName;
	private int taxExemptionAmount;
	private String status;
	private LocalDateTime requestedAt;
	private LocalDateTime approvedAt;
	private boolean useEscrow;
	private boolean cultureExpense;
	private String type;
	private String country;
	private boolean isPartialCancelable;
	private String currency;
	private int totalAmount;
	private int balanceAmount;
	private int suppliedAmount;
	private int vat;
	private int taxFreeAmount;
	private String method;
	private String version;

	@JsonProperty("receipt")
	private Receipt receipt;

	@JsonProperty("card")
	private Card card;

	@JsonProperty("easyPay")
	private EasyPay easyPay;

	@Data
	public static class Receipt {
		private String url;
	}

	@Data
	public static class Card {
		private String issuerCode;
		private String acquirerCode;
		private String number;
		private int installmentPlanMonths;
		private boolean isInterestFree;
		private String approveNo;
		private boolean useCardPoint;
		private String cardType;
		private String ownerType;
		private String acquireStatus;
		private String receiptUrl;
		private int amount;
	}

	@Data
	public static class EasyPay {
		private String provider;
		private int amount;
		private int discountAmount;
	}
}
