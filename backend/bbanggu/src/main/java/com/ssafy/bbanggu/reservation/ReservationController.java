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
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.reservation.dto.ReservationCancelRequest;
import com.ssafy.bbanggu.reservation.dto.ReservationCreateRequest;
import com.ssafy.bbanggu.reservation.dto.ReservationDTO;
import com.ssafy.bbanggu.reservation.dto.ReservationForOwner;
import com.ssafy.bbanggu.reservation.dto.ReservationResponse;
import com.ssafy.bbanggu.reservation.dto.ValidReservationRequest;

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
	 * @param request bakeryId, quantity
	 * @return reservationId, status
	 */
	@PostMapping("/check")
	public ResponseEntity<ApiResponse> valid (
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@Valid @RequestBody ValidReservationRequest request
	) {
		log.info("✨ 빵꾸러미 예약 검증 ✨");
		Map<String, Object> response = reservationService.validateReservation(userDetails, request);
		return ResponseEntity.ok().body(new ApiResponse("빵꾸러미 예약 검증이 완료되었습니다.", response));
	}


	/**
	 * 예약 생성 (CONFIRMED) API
	 *
	 * @param userDetails 현재 로그인한 사용자 정보
	 * @param reservation reservationId, paymentKey, amount, orderId
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


	/**
	 * 예약 취소 (CANCELED) API
	 *
	 * @param userDetails 현재 로그인한 사용자 정보
	 * @param request reservationId, cancelReason
	 * @return reservationId, status
	 */
	@PostMapping("/cancel")
	public ResponseEntity<ApiResponse> cancel(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@RequestBody ReservationCancelRequest request
	) {
		log.info("✨ 빵꾸러미 예약 취소 ✨");
		Map<String, Object> response = reservationService.cancelReservation(userDetails, request);
		return ResponseEntity.ok().body(new ApiResponse("예약 및 결제 취소가 완료되었습니다.", response));
	}


	/**
	 * 픽업 완료 처리 (COMPLETED) API
	 *
	 * @param userDetails 현재 로그인한 사용자 정보
	 * @param reservationId 완료할 예약 ID
	 * @return reservationId, status
	 */
	@PutMapping("/pickup/{reservationId}")
	public ResponseEntity<ApiResponse> pickup (
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@PathVariable long reservationId
	) {
		log.info("✨ 빵꾸러미 픽업 완료 처리 ✨");
		Map<String, Object> response = reservationService.pickUp(reservationId, userDetails);
		return ResponseEntity.ok().body(new ApiResponse("빵꾸러미 픽업 처리가 완료되었습니다.", response));
	}


	/**
	 * 기간 내 사용자 예약 조회 API
	 *
	 * @param userDetails 현재 로그인한 사용자 정보
	 * @param startDate 시작일
	 * @param endDate 종료일
	 * @return 사용자 기간 내 예약 리스트
	 */
	@GetMapping("/{startDate}/{endDate}")
	public ResponseEntity<?> getUserReservationList (
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@PathVariable LocalDate startDate, @PathVariable LocalDate endDate
	) {
		log.info("✨ 기간 내 사용자 예약 조회 ✨");
		List<ReservationResponse> reservationList = reservationService.getUserReservationList(userDetails, startDate, endDate);
		if (reservationList.isEmpty()) {
			ResponseEntity.status(HttpStatus.NO_CONTENT).body(new ApiResponse("기간 내 사용자 예약이 존재하지 않습니다.", null));
		}
		return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("기간 내 사용자 예약 조회가 완료되었습니다.", reservationList));
	}


	/**
	 * 사장님 오늘의 예약 조회
	 *
	 * @param userDetails 현재 로그인한 사용자 정보
	 * @param bakeryId 빵집 ID
	 * @return List<Reservation>, total, endTime
	 */
	@GetMapping("/{bakeryId}")
	public ResponseEntity<ApiResponse> getOwnerReservationList(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@PathVariable long bakeryId
	){
		ReservationForOwner response = reservationService.getTodayOwnerReservations(userDetails, bakeryId);
		return ResponseEntity.ok().body(new ApiResponse("오늘의 예약 내역 조회에 성공하였습니다.", response));
	}


	@GetMapping("/bakery/{bakeryId}/{startDate}/{endDate}")
	public ResponseEntity<ApiResponse> getOwnerReservationList(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@PathVariable long bakeryId,
		@PathVariable LocalDate startDate, @PathVariable LocalDate endDate
	) {
		List<ReservationResponse> reservationList = reservationService.getOwnerReservationList(userDetails, bakeryId, startDate, endDate);
		if (reservationList.isEmpty()) {
			ResponseEntity.status(HttpStatus.NO_CONTENT).body(new ApiResponse("예약이 없습니다.", null));
		}
		return ResponseEntity.ok().body(new ApiResponse("기간 내 가게 예약 조회가 완료되었습니다.", reservationList));
	}

	/**
	 * 특정 가게의 노쇼 예약을 수동 처리하는 API
	 */
	@PostMapping("/process-missed/{bakeryId}")
	public ResponseEntity<String> processMissedReservations(@PathVariable Long bakeryId) {
		reservationService.processMissedReservations(bakeryId);
		return ResponseEntity.ok("✅ [" + bakeryId + "] 노쇼 예약이 자동 픽업 처리되었습니다.");
	}


	/**
	 * 예약 ID로 예약 상세 조회 API
	 *
	 * @param userDetails 현재 로그인한 사용자 정보
	 * @param reservationId 예약 ID
	 * @return 해당 예약 상세 정보
	 */
	@GetMapping("/{reservationId}/detail")
	public ResponseEntity<ApiResponse> getReservationInfo(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@PathVariable Long reservationId
	){
		Map<String, Object> response = reservationService.getReservationInfo(userDetails, reservationId);
		return ResponseEntity.ok(new ApiResponse("해당 예약 정보를 불러오는데에 성공하였습니다.", response));
	}

}
