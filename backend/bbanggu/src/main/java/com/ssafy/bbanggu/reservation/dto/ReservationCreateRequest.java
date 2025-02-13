package com.ssafy.bbanggu.reservation.dto;

import jakarta.validation.constraints.NotNull;

public record ReservationCreateRequest (
	@NotNull(message = "필수 필드인 '예약 ID'가 없습니다.")
	Long reservationId,
	@NotNull(message = "필수 필드인 'paymentKey'가 없습니다.")
	String paymentKey,
	@NotNull(message = "필수 필드인 'amount'가 없습니다.")
	int amount,
	@NotNull(message = "필수 필드인 'orderId'가 없습니다.")
	String orderId
){}
