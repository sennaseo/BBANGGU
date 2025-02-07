package com.ssafy.bbanggu.reservation;

import com.ssafy.bbanggu.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reservation")
public class ReservationController {
	private final ReservationService reservationService;

	public ReservationController(ReservationService reservationService) {
		this.reservationService = reservationService;
	}

	@PostMapping("")
	public ResponseEntity<?> createReservation(@RequestBody ReservationDTO reservationDTO) {
		try {
			long reservationId = reservationService.createReservation(reservationDTO);
			return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("예약 생성 성공(id:" + reservationId + ")", null));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("예약 생성 실패");
		}
	}
}
