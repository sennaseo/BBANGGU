package com.ssafy.bbanggu.reservation.dto;

import java.time.LocalTime;
import java.util.List;

public record ReservationForOwner (
	List<ReservationInfo> infos,
	int totalNum,
	String endTime
){}
