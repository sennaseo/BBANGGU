package com.ssafy.bbanggu.review.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.review.dto.ReviewDto;
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
	// @PostMapping
	// public ResponseEntity<ApiResponse> createReview(
	// 	@AuthenticationPrincipal CustomUserDetails userDetails,
	// 	@RequestBody @Valid ReviewDto review
	// ){
	// 	if (!review.userId().equals(userDetails.getUserId())) {
	// 		throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
	// 	}
	//
	// 	ReviewDto createdReview = reviewService.createReview(review);
	// 	return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("리뷰 등록이 성공적으로 완료되었습니다.", createdReview));
	// }

}
