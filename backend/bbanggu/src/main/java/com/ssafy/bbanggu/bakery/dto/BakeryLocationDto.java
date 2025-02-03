package com.ssafy.bbanggu.bakery.dto;

import com.ssafy.bbanggu.bakery.Bakery;

public record BakeryLocationDto(
	Long bakeryId,
	String name,
	Double latitude,
	Double longitude
) {
	public static BakeryLocationDto from(Bakery bakery) {
		return new BakeryLocationDto(
			bakery.getBakeryId(),
			bakery.getName(),
			bakery.getLatitude(),
			bakery.getLongitude()
		);
	}
}
