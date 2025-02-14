package com.ssafy.bbanggu.reservation.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;

public record ReservationInfo (
	String name,
	String profileImageUrl,
	LocalDateTime paymentTime,
	String status,
	int quantitiy
){}
