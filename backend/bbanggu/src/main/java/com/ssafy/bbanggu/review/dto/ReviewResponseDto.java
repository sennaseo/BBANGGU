package com.ssafy.bbanggu.review.dto;

import java.time.LocalDateTime;

import com.ssafy.bbanggu.review.domain.Review;

public record ReviewResponseDto (
	Long reviewId,
	Long reservationId,
	int rating,
	String content,
	String reviewImageUrl,
	LocalDateTime createdAt
){
	public static ReviewResponseDto from(Review review) {
		return new ReviewResponseDto(
			review.getReviewId(),
			review.getReservation().getReservationId(),
			review.getRating(),
			review.getContent(),
			review.getReviewImageUrl(),
			review.getCreatedAt()
		);
	}
}
