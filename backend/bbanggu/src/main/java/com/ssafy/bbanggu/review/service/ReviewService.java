package com.ssafy.bbanggu.review.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.bbanggu.bakery.domain.Bakery;
import com.ssafy.bbanggu.bakery.repository.BakeryRepository;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.reservation.Reservation;
import com.ssafy.bbanggu.reservation.ReservationRepository;
import com.ssafy.bbanggu.review.domain.Review;
import com.ssafy.bbanggu.review.dto.ReviewDto;
import com.ssafy.bbanggu.review.dto.ReviewRatingDto;
import com.ssafy.bbanggu.review.dto.ReviewResponseDto;
import com.ssafy.bbanggu.review.repository.ReviewRepository;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;
import com.ssafy.bbanggu.util.image.ImageService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

	private final ReservationRepository reservationRepository;
	private final ReviewRepository reviewRepository;
	private final BakeryRepository bakeryRepository;
	private final UserRepository userRepository;
	private final ImageService imageService;

	/**
	 * 리뷰 등록
	 */
	@Transactional
	public ReviewDto createReview(Long userId, ReviewDto request, MultipartFile reviewImage) {
		Long reservationId = request.reservationId();

		// ✅ 해당 ID의 예약이 존재하는지 정보 조회
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
		if (reviewRepository.existsByReservation_ReservationId(reservationId)) {
			throw new CustomException(ErrorCode.REVIEW_ALREADY_EXISTS);
		}

		Bakery bakery = bakeryRepository.findById(reservation.getBakery().getBakeryId())
			.orElseThrow(() -> new CustomException(ErrorCode.BAKERY_NOT_FOUND));

		String reviewImageUrl = null;
		try {
			if (reviewImage != null && !reviewImage.isEmpty()) {
				reviewImageUrl = imageService.saveImage(reviewImage);
			}
		} catch (IOException e) {
			throw new CustomException(ErrorCode.REVIEW_IMAGE_UPLOAD_FAILED);
		}

		Review review = Review.builder()
			.user(reservation.getUser())
			.bakery(bakery)
			.reservation(reservation)
			.rating(request.rating())
			.content(request.content())
			.reviewImageUrl(reviewImageUrl)
			.build();

		Review savedReview = reviewRepository.save(review);
		updateBakeryReviewState(bakery, request.rating(), true);
		return ReviewDto.from(savedReview);
	}


	/**
	 * 가게 리뷰 정보 업데이트 (평점, 리뷰 수)
	 */
	private void updateBakeryReviewState(Bakery bakery, Integer rating, boolean is_created) {
		if (is_created) {
			bakery.setReviewCnt(bakery.getReviewCnt() + 1);

			switch (rating) {
				case 1 -> bakery.setRating1Cnt(bakery.getRating1Cnt() + 1);
				case 2 -> bakery.setRating2Cnt(bakery.getRating2Cnt() + 1);
				case 3 -> bakery.setRating3Cnt(bakery.getRating3Cnt() + 1);
				case 4 -> bakery.setRating4Cnt(bakery.getRating4Cnt() + 1);
				case 5 -> bakery.setRating5Cnt(bakery.getRating5Cnt() + 1);
				default -> throw new CustomException(ErrorCode.INVALID_RATING);
			}
		} else {
			bakery.setReviewCnt(bakery.getReviewCnt() - 1);

			switch (rating) {
				case 1 -> bakery.setRating1Cnt(bakery.getRating1Cnt() - 1);
				case 2 -> bakery.setRating2Cnt(bakery.getRating2Cnt() - 1);
				case 3 -> bakery.setRating3Cnt(bakery.getRating3Cnt() - 1);
				case 4 -> bakery.setRating4Cnt(bakery.getRating4Cnt() - 1);
				case 5 -> bakery.setRating5Cnt(bakery.getRating5Cnt() - 1);
				default -> throw new CustomException(ErrorCode.INVALID_RATING);
			}
		}

		double newRating = calculateNewRatingAverage(bakery);
		bakery.setStar(newRating);

		bakeryRepository.save(bakery);
	}


	/**
	 * 새로운 평균 평점 계산
	 */
	private double calculateNewRatingAverage(Bakery bakery) {
		int totalReviews = bakery.getReviewCnt();
		int totalRatingSum =
			bakery.getRating1Cnt() +
			(2 * bakery.getRating2Cnt()) +
			(3 * bakery.getRating3Cnt()) +
			(4 * bakery.getRating4Cnt()) +
			(5 * bakery.getRating5Cnt());

		if (totalReviews == 0) {
			return 0;
		}
		return (double) totalRatingSum / totalReviews;
	}


	/**
	 * 리뷰 삭제
	 */
	@Transactional
	public void delete(Long userId, long reviewId) {
		Review review = reviewRepository.findById(reviewId)
			.orElseThrow(() -> new CustomException(ErrorCode.RESERVATION_NOT_FOUND));

		if (!review.getUser().getUserId().equals(userId)) {
			throw new CustomException(ErrorCode.FORBIDDEN_REVIEW);
		}

		review.setDeletedAt(LocalDateTime.now());
		reviewRepository.save(review);

		updateBakeryReviewState(review.getBakery(), review.getRating(), false);
	}


	/**
	 * 사용자 리뷰 조회
	 */
	public List<ReviewResponseDto> getUserReviews(Long userId) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		List<Review> reviews = reviewRepository.findByUserAndDeletedAtIsNullOrderByCreatedAtDesc(user);

		return reviews.stream()
			.map(review -> new ReviewResponseDto(
				review.getReviewId(),
				review.getReservation().getReservationId(),
				review.getRating(),
				review.getContent(),
				review.getReviewImageUrl(),
				review.getCreatedAt()
			)).collect(Collectors.toList());
	}


	/**
	 * 가게 리뷰 조회
	 */
	public List<ReviewResponseDto> getBakeryReviews(Long bakeryId, boolean photoOnly) {
		Bakery bakery = bakeryRepository.findByBakeryIdAndDeletedAtIsNull(bakeryId);
		if (bakery == null) {
			throw new CustomException(ErrorCode.BAKERY_NOT_FOUND);
		}

		List<Review> reviews;
		if(photoOnly) {
			reviews = reviewRepository.findPhotoReviewsByBakery(bakery);
		} else {
			reviews = reviewRepository.findByBakeryAndDeletedAtIsNullOrderByCreatedAtDesc(bakery);
		}

		return reviews.stream()
			.map(review -> new ReviewResponseDto(
				review.getReviewId(),
				review.getReservation().getReservationId(),
				review.getRating(),
				review.getContent(),
				review.getReviewImageUrl(),
				review.getCreatedAt()
			)).collect(Collectors.toList());
	}


	/**
	 * 가게 평점 조회
	 */
	public ReviewRatingDto getBakeryRating(Long bakeryId) {
		Bakery bakery = bakeryRepository.findByBakeryIdAndDeletedAtIsNull(bakeryId);
		if (bakery == null) {
			throw new CustomException(ErrorCode.BAKERY_NOT_FOUND);
		}

		List<Integer> star_cnt = new ArrayList<>();
		star_cnt.add(bakery.getRating1Cnt());
		star_cnt.add(bakery.getRating2Cnt());
		star_cnt.add(bakery.getRating3Cnt());
		star_cnt.add(bakery.getRating4Cnt());
		star_cnt.add(bakery.getRating5Cnt());

		ReviewRatingDto rating = new ReviewRatingDto(bakeryId, bakery.getStar(), star_cnt);
		return rating;
	}

}
