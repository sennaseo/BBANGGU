package com.ssafy.bbanggu.review.service;

import org.springframework.stereotype.Service;

import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.reservation.Reservation;
import com.ssafy.bbanggu.reservation.ReservationRepository;
import com.ssafy.bbanggu.review.dto.ReviewDto;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

	private final ReservationRepository reservationRepository;

	/**
	 * 리뷰 등록
	 */
	// @Transactional
	// public ReviewDto createReview(CustomUserDetails userDetails, ReviewDto review) {
	// 	// ✅ 사용자가 해당 예약을 했는지 검증
	// 	Reservation reservation = reservationRepository.findById(review.)
	// 		.orElseThrow(() -> new CustomException(ErrorCode.))
	// }
}
