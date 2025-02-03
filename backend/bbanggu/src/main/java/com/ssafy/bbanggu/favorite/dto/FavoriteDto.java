package com.ssafy.bbanggu.favorite.dto;

import com.ssafy.bbanggu.favorite.Favorite;

public record FavoriteDto(
	Long userId,
	Long bakeryId
) {
	public static FavoriteDto from(Favorite favorite) {
		return new FavoriteDto(
			favorite.getUserId(),
			favorite.getBakeryId()
		);
	}
}
