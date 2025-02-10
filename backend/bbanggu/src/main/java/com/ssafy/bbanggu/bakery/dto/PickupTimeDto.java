package com.ssafy.bbanggu.bakery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PickupTimeDto {
	private String startTime;
	private String endTime;
}
