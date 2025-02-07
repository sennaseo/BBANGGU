package com.ssafy.bbanggu.bakery.dto;

import com.ssafy.bbanggu.bakery.Bakery;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BakeryDto(
	Long bakeryId,
	@NotBlank(message = "가게 이름은 필수 입력 값입니다.")
	String name,
	String description,
	@NotBlank(message = "사업자 등록 번호는 필수 입력 값입니다.")
	String businessRegistrationNumber,
	@NotBlank(message = "도로명 주소는 필수 입력 값입니다.")
	String addressRoad,
	@NotBlank(message = "상세 주소는 필수 입력 값입니다.")
	String addressDetail,
	String photoUrl,
	@NotNull(message = "사용자 ID는 필수 입력 값입니다.")
	Long userId
) {
	public static BakeryDto from(Bakery bakery) {
		return new BakeryDto(
			bakery.getBakeryId(),
			bakery.getName(),
			bakery.getDescription(),
			bakery.getBusinessRegistrationNumber(),
			bakery.getAddressRoad(),
			bakery.getAddressDetail(),
			bakery.getPhotoUrl(),
			bakery.getUser().getUserId()
		);
	}
}
