package com.ssafy.bbanggu.reservation.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public record ReservationInfo (
	Long reservationId,
	String name,
	String profileImageUrl,
	String phone,
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
	LocalDateTime paymentTime,
	String status,
	int quantitiy
){}
