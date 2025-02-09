package com.ssafy.bbanggu.reservation;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.bbanggu.common.response.ApiResponse;

@RestController
@RequestMapping("/reservation")
public class ReservationController {
	private final ReservationService reservationService;

	public ReservationController(ReservationService reservationService) {
		this.reservationService = reservationService;
	}

	@PostMapping("/create")
	public ResponseEntity<?> create(@RequestBody ReservationDTO reservationDto, @RequestParam String orderId,
		@RequestParam String paymentKey, @RequestParam int amount) {
		// 결제 검증
		// 객체 생성 및 저장
		try {
			reservationService.createReservation(reservationDto, orderId, paymentKey, amount);
			return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponse("결제 검증 및 예약 생성 성공", null));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponse("결제 검증 및 예약 생성 실패", null));
		}
	}

	@PostMapping("/cancel")
	public ResponseEntity<?> cancel(@RequestParam long reservationId, @RequestParam String cancelReason) {
		try {
			reservationService.cancelReservation(reservationId, cancelReason);
			return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ApiResponse("예약 및 결제 취소 성공", reservationId));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponse("예약 및 결제 취소 실패", null));
		}
	}
}
