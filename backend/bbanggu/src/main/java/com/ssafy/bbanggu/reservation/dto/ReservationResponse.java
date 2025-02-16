package com.ssafy.bbanggu.reservation.dto;

import java.time.LocalDateTime;

public record ReservationResponse(
	Long reservationId,
	Long bakeryId,
	String bakeryName,
	LocalDateTime createdAt,
	LocalDateTime pickupAt,
	String status
){}
