package com.ssafy.bbanggu.review.service;

import org.springframework.stereotype.Service;

import com.ssafy.bbanggu.bakery.domain.Bakery;
import com.ssafy.bbanggu.bakery.repository.BakeryRepository;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.reservation.Reservation;
import com.ssafy.bbanggu.reservation.ReservationRepository;
import com.ssafy.bbanggu.review.domain.Review;
import com.ssafy.bbanggu.review.dto.ReviewDto;
import com.ssafy.bbanggu.review.repository.ReviewRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

	private final ReservationRepository reservationRepository;
	private final ReviewRepository reviewRepository;
	private final BakeryRepository bakeryRepository;

	/**
	 * 리뷰 등록
	 */
	@Transactional
	public ReviewDto createReview(Long userId, ReviewDto request) {
		Long reservationId = request.reservationId();

		// 예약 정보 조회
		Reservation reservation = reservationRepository.findById(reservationId)
			.orElseThrow(() -> new CustomException(ErrorCode.RESERVATION_NOT_FOUND));

		// ✅ 본인이 예약한 주문인지 확인
		if (!reservation.getUser().getUserId().equals(userId)) {
			throw new CustomException(ErrorCode.FORBIDDEN_REVIEW);
		}

		// ✅ 픽업 완료된 예약인지 확인
		if (reservation.getPickupAt() == null) {
			throw new CustomException(ErrorCode.REVIEW_NOT_ALLOWED);
		}

		// ✅ 해당 예약에 대해 이미 리뷰가 작성되었는지 확인
		if (reviewRepository.existsByReservationId(reservationId)) {
			throw new CustomException(ErrorCode.REVIEW_ALREADY_EXISTS);
		}

		Bakery bakery = bakeryRepository.findById(reservation.getBakery().getBakeryId())
			.orElseThrow(() -> new CustomException(ErrorCode.BAKERY_NOT_FOUND));

		Review review = Review.builder()
			.user(reservation.getUser())
			.bakery(bakery)
			.reservation(reservation)
			.rating(request.rating())
			.content(request.content())
			.reviewImageUrl(request.reviewImgUrl())
			.build();

		Review savedReview = reviewRepository.save(review);
		return ReviewDto.from(savedReview);
	}
}
