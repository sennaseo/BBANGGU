package com.ssafy.bbanggu.breadpackage.dto;

import com.ssafy.bbanggu.breadpackage.BreadPackage;

public record BreadPackageDto (
	Long packageId,
	Long bakeryId,
	Integer price,
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
