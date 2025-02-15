package com.ssafy.bbanggu.breadpackage.dto;

import com.ssafy.bbanggu.breadpackage.BreadPackage;

public record TodayBreadPackageDto (
	Long packageId,
	Long bakeryId,
	String name,
	Integer price,
	Integer initialQuantity,
	Integer quantity,
	Integer savedMoney
) {
	public static TodayBreadPackageDto from(BreadPackage breadPackage, int savedMoney) {
		return new TodayBreadPackageDto(
			breadPackage.getPackageId(),
			breadPackage.getBakery().getBakeryId(),
			breadPackage.getName(),
			breadPackage.getPrice(),
			breadPackage.getInitialQuantity(),
			breadPackage.getQuantity(),
			savedMoney
		);
	}
}
