package com.ssafy.bbanggu.review.dto;

import java.time.LocalDateTime;

import com.ssafy.bbanggu.review.domain.Review;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReviewResponseDto {
	private Long reviewId;
	private Long reservationId;
	private int rating;
	private String content;
	private String reviewImageUrl;
	private LocalDateTime createdAt;

	public ReviewResponseDto(Review review) {
		this.reviewId = review.getReviewId();
		this.reservationId = review.getReservation().getReservationId();
		this.rating = review.getRating();
		this.content = review.getContent();
		this.reviewImageUrl = review.getReviewImageUrl();
		this.createdAt = review.getCreatedAt();
	}
}
