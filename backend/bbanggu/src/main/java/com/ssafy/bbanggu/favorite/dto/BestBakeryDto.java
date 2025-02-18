package com.ssafy.bbanggu.favorite.dto;

public record BestBakeryDto (
	Long bakeryId,
	String packageName,
	String bakeryName,
	String bakeryImageUrl,
	boolean is_liked
){
	public static BestBakeryDto from(Long bakeryId, String packageName, String bakeryName, String bakeryImageUrl, boolean is_liked) {
		return new BestBakeryDto(
			bakeryId,
			packageName,
			bakeryName,
			bakeryImageUrl,
			is_liked
		);
	}
}
