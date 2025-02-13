package com.ssafy.bbanggu.reservation.dto;

import jakarta.validation.constraints.NotNull;

public record ReservationCreateRequest (
	@NotNull(message = "필수 필드인 '예약 ID'가 없습니다.")
	Long reservationId,
	@NotNull(message = "필수 필드인 '결제 키'가 없습니다.")
	String paymentKey
){}
