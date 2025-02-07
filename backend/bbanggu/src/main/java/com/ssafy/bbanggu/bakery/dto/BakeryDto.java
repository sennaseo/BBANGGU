package com.ssafy.bbanggu.bakery.dto;

import com.ssafy.bbanggu.bakery.Bakery;

public record BakeryDto(
	Long bakeryId,
	String name,
	String description,
	String addressRoad,
	String addressDetail,
	String photoUrl
) {
	public static BakeryDto from(Bakery bakery) {
		return new BakeryDto(
			bakery.getBakeryId(),
			bakery.getName(),
			bakery.getDescription(),
			bakery.getAddressRoad(),
			bakery.getAddressDetail(),
			bakery.getPhotoUrl()
		);
	}
}
