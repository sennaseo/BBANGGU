package com.ssafy.bbanggu.reservation.dto;

import jakarta.validation.constraints.NotNull;

public record ReservationCancelRequest (
	@NotNull(message = "필수 필드인 '예약 ID'가 없습니다.")
	Long reservationId,
	String cancelReason
){}
