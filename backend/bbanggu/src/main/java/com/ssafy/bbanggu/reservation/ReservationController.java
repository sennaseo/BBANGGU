package com.ssafy.bbanggu.reservation;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.bbanggu.bread.Bread;
import com.ssafy.bbanggu.breadpackage.BreadPackage;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.reservation.dto.ReservationCreateRequest;
import com.ssafy.bbanggu.reservation.dto.ReservationDTO;
import com.ssafy.bbanggu.reservation.dto.checkQuantityRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/reservation")
public class ReservationController {

	private final ReservationService reservationService;

	/**
	 * 예약 생성 (PENDING) API
	 *
	 * @param userDetails 현재 로그인한 사용자 정보
	 * @param request breadPackageId, quantity
	 * @return reservationId, status
	 */
	@PostMapping("/check")
	public ResponseEntity<ApiResponse> checkQuantity(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@Valid @RequestBody checkQuantityRequest request
	) {
		log.info("✨ 빵꾸러미 예약 검증 ✨");
		Map<String, Object> response = reservationService.validateReservation(userDetails, request);
		return ResponseEntity.ok().body(new ApiResponse("빵꾸러미 예약 검증이 완료되었습니다.", response));
	}


	/**
	 * 예약 생성 API
	 *
	 * @param userDetails 현재 로그인한 사용자 정보
	 * @param reservation reservationId, paymentKey
	 * @return reservationId, status
	 */
	@PostMapping
	public ResponseEntity<ApiResponse> create(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@Valid @RequestBody ReservationCreateRequest reservation
	) {
		log.info("✨ 빵꾸러미 예약 생성 ✨");
		Map<String, Object> response = reservationService.createReservation(userDetails, reservation);
		return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("결제 검증 및 예약 생성에 성공하였습니다.", response));
	}

	@PostMapping("/cancel")
	public ResponseEntity<?> cancel(@RequestParam long reservationId, @RequestParam String cancelReason,
									@RequestHeader("Authorization") String authorization) {
		if (!reservationService.check(reservationId, authorization)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new ApiResponse("사용자의 예약이 아닙니다.", null));
		}

		try {
			reservationService.cancelReservation(reservationId, cancelReason);
			return ResponseEntity.status(HttpStatus.OK)
				.body(new ApiResponse("예약 및 결제 취소 성공", reservationId));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponse("예약 및 결제 취소 실패", null));
		}
	}

	@PutMapping("/pickup/{reservationId}")
	public ResponseEntity<?> pickup(@PathVariable long reservationId,
									@RequestHeader("Authorization") String authorization) {
		if (!reservationService.check(reservationId, authorization)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new ApiResponse("사용자의 예약이 아닙니다.", null));
		}

		try {
			reservationService.pickUp(reservationId);
			return ResponseEntity.status(HttpStatus.OK)
				.body(new ApiResponse("픽업 처리 성공", null));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponse("픽업 처리 실패", null));
		}
	}

	@GetMapping("/{startDate}/{endDate}")
	public ResponseEntity<?> getUserReservationList(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@PathVariable LocalDate startDate,
		@PathVariable LocalDate endDate
	) {
		Long userId = userDetails.getUserId();
		try {
			List<ReservationDTO> reservationList = reservationService.getUserReservationList(userId, startDate, endDate);
			if (reservationList.isEmpty()) {
				ResponseEntity.status(HttpStatus.NO_CONTENT)
					.body(new ApiResponse("예약이 없습니다.", null));
			}
			return ResponseEntity.status(HttpStatus.OK)
				.body(new ApiResponse("사용자 예약 현황 조회 성공", reservationList));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponse("사용자 예약 현황 조회 실패", null));
		}
	}

	@GetMapping("/bakery/{bakeryId}/{startDate}/{endDate}")
	public ResponseEntity<?> getOwnerReservationList(@RequestHeader("Authorization") String authorization, @PathVariable long bakeryId,
													 @PathVariable LocalDate startDate, @PathVariable LocalDate endDate) {
		try {
			List<ReservationDTO> reservationList = reservationService.getOwnerReservationList(authorization, bakeryId, startDate, endDate);
			if (reservationList.isEmpty()) {
				ResponseEntity.status(HttpStatus.NO_CONTENT)
					.body(new ApiResponse("예약이 없습니다.", null));
			}
			return ResponseEntity.status(HttpStatus.OK)
				.body(new ApiResponse("가게 예약 현황 조회 성공", reservationList));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponse("가게 예약 현황 조회 실패", null));
		}
	}

}
