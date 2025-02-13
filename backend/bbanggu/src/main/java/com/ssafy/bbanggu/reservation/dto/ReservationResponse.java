package com.ssafy.bbanggu.reservation.dto;

import java.time.LocalDateTime;

public record ReservationResponse(
	String name,
	LocalDateTime createdAt,
	int quantity,
	String profileImageUrl
){}
