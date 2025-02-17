package com.ssafy.bbanggu.review.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.review.dto.ReviewDto;
import com.ssafy.bbanggu.review.dto.ReviewRatingDto;
import com.ssafy.bbanggu.review.dto.ReviewResponseDto;
import com.ssafy.bbanggu.review.service.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/review")
public class ReviewController {

	private final ReviewService reviewService;

	/**
	 * 리뷰 등록 api
	 */
	@PostMapping
	public ResponseEntity<ApiResponse> createReview(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@Valid @RequestPart(name = "review", required = false) ReviewDto review,
		@RequestPart(name = "reviewImage", required = false) MultipartFile reviewImage
	){
		ReviewDto createdReview = reviewService.createReview(userDetails.getUserId(), review, reviewImage);
		return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("리뷰 등록이 성공적으로 완료되었습니다.", createdReview));
	}

	/**
	 * 리뷰 삭제 api
	 */
	@DeleteMapping("/{review_id}")
	public ResponseEntity<ApiResponse> deleteReview(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@PathVariable Long review_id
	) {
		reviewService.delete(userDetails.getUserId(), review_id);
		return ResponseEntity.ok().body(new ApiResponse("리뷰 삭제가 성공적으로 완료되었습니다.", null));
	}


	/**
	 * 사용자 별 리뷰 조회 api
	 */
	@GetMapping("/user/{user_id}")
	public ResponseEntity<ApiResponse> getUserReview(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@PathVariable Long user_id
	){
		List<ReviewResponseDto> reviews = reviewService.getUserReviews(userDetails.getUserId());
		return ResponseEntity.ok().body(new ApiResponse("사용자가 작성한 리뷰를 모두 조회하였습니다.", reviews));
	}

	/**
	 * 가게 리뷰 조회 api
	 */
	@GetMapping("/bakery/{bakery_id}")
	public ResponseEntity<ApiResponse> getBakeryReview(
		@PathVariable Long bakery_id,
		@RequestParam(required = false, defaultValue = "false") boolean photoOnly
	){
		List<ReviewResponseDto> reviews = reviewService.getBakeryReviews(bakery_id, photoOnly);
		return ResponseEntity.ok().body(new ApiResponse("가게에 작성된 리뷰를 모두 조회하였습니다.", reviews));
	}

	/**
	 * 가게 별점 조회 api
	 */
	@GetMapping("/{bakery_id}/rating")
	public ResponseEntity<ApiResponse> getBakeryRating(@PathVariable Long bakery_id) {
		ReviewRatingDto rating = reviewService.getBakeryRating(bakery_id);
		return ResponseEntity.ok().body(new ApiResponse("가게의 평점 조회가 완료되었습니다.", rating));
	}

}
