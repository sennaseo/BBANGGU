package com.ssafy.bbanggu.review.dto;

import com.ssafy.bbanggu.review.domain.Review;

import jakarta.validation.constraints.NotBlank;

public record ReviewDto (
	Long reviewId,
	@NotBlank(message = "사용자 ID는 필수 입력 값입니다.")
	Long userId,
	@NotBlank(message = "가게 ID는 필수 입력 값입니다.")
	Long bakeryId,
	@NotBlank(message = "별점은 필수 입력 값입니다.")
	Integer rating,
	String reviewImgUrl,
	@NotBlank(message = "리뷰 내용은 필수 입력 값입니다.")
	String content

){
	public static ReviewDto from(Review review) {
		return new ReviewDto(
			review.getReviewId(),
			review.getUser().getUserId(),
			review.getBakery().getBakeryId(),
			review.getRating(),
			review.getReviewImageUrl(),
			review.getContent()
		);
	}
}
