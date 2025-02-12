package com.ssafy.bbanggu.bakery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BakeryPickupTimetableDto {
	private PickupTimeDto Sunday;
	private PickupTimeDto Monday;
	private PickupTimeDto Tuesday;
	private PickupTimeDto Wednesday;
	private PickupTimeDto Thursday;
	private PickupTimeDto Friday;
	private PickupTimeDto Saturday;

}
