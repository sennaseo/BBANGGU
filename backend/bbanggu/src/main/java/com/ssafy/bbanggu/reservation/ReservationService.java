package com.ssafy.bbanggu.reservation;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bbanggu.bakery.Bakery;
import com.ssafy.bbanggu.breadpackage.BreadPackage;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.payment.PaymentService;
import com.ssafy.bbanggu.user.domain.User;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ReservationService {

	private final ReservationRepository reservationRepository;
	private final PaymentService paymentService;

	public ReservationService(ReservationRepository reservationRepository, PaymentService paymentService) {
		this.reservationRepository = reservationRepository;
		this.paymentService = paymentService;
	}

	public void createReservation(ReservationDTO reservationDto, String orderId, String paymentKey, int amount) {
		// 결제 정보 검증
		ResponseEntity<String> response = paymentService.check(orderId, paymentKey, amount);
		if (response.getStatusCode() != HttpStatus.OK) {
			throw new CustomException(ErrorCode.PAYMENT_NOT_VALID);
		}
		System.out.println("결제 정보 검증 완료");

		// orderId 추출 및 DTO에 추가
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode jsonNode = objectMapper.readTree(response.getBody());
			reservationDto.setOrderId(jsonNode.get("paymentKey").asText());        // 임시로 paymentKey 넣음. 원래는 orderId
			Reservation reservation = dtoToEntity(reservationDto);
			System.out.println("Entity로 변환 성공");
			System.out.println(reservation.getOrderId());
			reservationRepository.save(reservation);
			System.out.println("reservation save 성공");
		} catch (JsonProcessingException e) {
			throw new RuntimeException(e);
		}
	}

	public void cancelReservation(long reservationId, String cancelReason) {
		// 예약 정보 조회
		Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
		if (reservation == null) {
			throw new CustomException(ErrorCode.RESERVATION_NOT_FOUND);
		}
		// 결제 취소
		ResponseEntity<String> response = paymentService.cancelPayment(reservation.getOrderId(), cancelReason);
		System.out.println(response.getBody());

		// 예약 정보 업데이트
		reservation.setCancelledAt(LocalDateTime.now());
		reservation.setStatus("CANCELED");
	}

	/* =========== 변환 메소드 ============= */

	private ReservationDTO entityToDto(Reservation reservation) {
		return ReservationDTO.builder()
			.reservationId(reservation.getReservationId())
			.userId(reservation.getUser().getUserId())
			.bakeryId(reservation.getBakery().getBakeryId())
			.breadPackageId(reservation.getBreadPackage().getPackageId())
			.quantity(reservation.getQuantity())
			.totalPrice(reservation.getTotalPrice())
			.reservedPickupTime(reservation.getReservedPickupTime())
			.createdAt(LocalDateTime.now())
			.status("RESERVATION_CONFIRMED")
			.orderId(reservation.getOrderId())
			.build();
	}

	private Reservation dtoToEntity(ReservationDTO reservationDto) {
		User user = User.builder()
			.userId(reservationDto.getUserId())
			.build();

		Bakery bakery = Bakery.builder()
			.bakeryId(reservationDto.getBakeryId())
			.build();

		BreadPackage breadPackage = BreadPackage.builder()
			.packageId(reservationDto.getBreadPackageId())
			.build();

		return Reservation.builder()
			.user(user)
			.bakery(bakery)
			.breadPackage(breadPackage)
			.quantity(reservationDto.getQuantity())
			.totalPrice(reservationDto.getTotalPrice())
			.reservedPickupTime(reservationDto.getReservedPickupTime())
			.createdAt(reservationDto.getCreatedAt())
			.status(reservationDto.getStatus())
			.orderId(reservationDto.getOrderId())
			.build();
	}

}
