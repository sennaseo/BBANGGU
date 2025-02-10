package com.ssafy.bbanggu.reservation;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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
	public ResponseEntity<?> getUserReservationList(@RequestHeader("Authorization") String authorization, @PathVariable LocalDate startDate, @PathVariable LocalDate endDate) {
		try {
			List<ReservationDTO> reservationList = reservationService.getUserReservationList(authorization, startDate, endDate);
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
