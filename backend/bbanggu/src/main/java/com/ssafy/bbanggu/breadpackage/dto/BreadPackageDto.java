package com.ssafy.bbanggu.breadpackage.dto;

import com.ssafy.bbanggu.breadpackage.BreadPackage;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BreadPackageDto (
	Long packageId,
	@NotNull(message = "필수 입력 필드 '베이커리 ID'가 입력되지 않았습니다.")
	Long bakeryId,
	@NotNull(message = "필수 입력 필드 '가격'이 입력되지 않았습니다.")
	Integer price,
	@NotNull(message = "필수 입력 필드 '개수'가 입력되지 않았습니다.")
	Integer quantity,
	String name
) {
	public static BreadPackageDto from(BreadPackage breadPackage) {
		return new BreadPackageDto(
			breadPackage.getPackageId(),
			breadPackage.getBakery().getBakeryId(),
			breadPackage.getPrice(),
			breadPackage.getQuantity(),
			breadPackage.getName()
		);
	}
}
