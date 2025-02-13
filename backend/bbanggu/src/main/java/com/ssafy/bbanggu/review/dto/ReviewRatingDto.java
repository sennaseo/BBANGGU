package com.ssafy.bbanggu.review.dto;

import java.util.List;

public record ReviewRatingDto(
	Long bakeryId,
	Double average,
	List<Integer> star_rating
){
	public static ReviewRatingDto from(Long bakeryId, Double average, List<Integer> star_rating) {
		return new ReviewRatingDto(
			bakeryId,
			average,
			star_rating
		);
	}
}
