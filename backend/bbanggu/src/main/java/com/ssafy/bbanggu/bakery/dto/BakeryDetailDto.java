package com.ssafy.bbanggu.bakery.dto;

import com.ssafy.bbanggu.bakery.domain.Bakery;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BakeryDetailDto(
	Long bakeryId,
	@NotNull(message = "사용자 ID는 필수 입력 값입니다.")
	Long userId,
	@NotBlank(message = "가게 이름은 필수 입력 값입니다.")
	String name,
	String description,
	@NotBlank(message = "사업자 등록 번호는 필수 입력 값입니다.")
	String businessRegistrationNumber,
	@NotBlank(message = "도로명 주소는 필수 입력 값입니다.")
	String addressRoad,
	@NotBlank(message = "상세 주소는 필수 입력 값입니다.")
	String addressDetail,
	String bakeryImageUrl,
	String bakeryBackgroundImgUrl,
	Double star,
	Double distance
) {
	public static BakeryDetailDto from(Bakery bakery, double distance) {
		return new BakeryDetailDto(
			bakery.getBakeryId(),
			bakery.getUser().getUserId(),
			bakery.getName(),
			bakery.getDescription(),
			bakery.getBusinessRegistrationNumber(),
			bakery.getAddressRoad(),
			bakery.getAddressDetail(),
			bakery.getBakeryImageUrl(),
			bakery.getBakeryBackgroundImgUrl(),
			bakery.getStar(),
			distance
		);
	}
}
