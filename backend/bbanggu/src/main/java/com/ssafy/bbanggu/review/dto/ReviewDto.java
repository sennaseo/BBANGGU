package com.ssafy.bbanggu.review.dto;

import com.ssafy.bbanggu.review.domain.Review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ReviewDto (
	@NotNull(message = "예약 Id는 필수 입력 값입니다.")
	Long reservationId,
	@Min(value = 1, message = "별점은 최소 1점 이상이어야 합니다.")
	@Max(value = 5, message = "별점은 최대 5점까지 가능합니다.")
	Integer rating,
	String reviewImgUrl,
	@NotBlank(message = "리뷰 내용은 필수 입력 값입니다.")
	String content

){
	public static ReviewDto from(Review review) {
		return new ReviewDto(
			review.getReservation().getReservationId(),
			review.getRating(),
			review.getReviewImageUrl(),
			review.getContent()
		);
	}
}
