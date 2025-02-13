package com.ssafy.bbanggu.reservation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.ssafy.bbanggu.breadpackage.BreadPackageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bbanggu.auth.security.JwtTokenProvider;
import com.ssafy.bbanggu.bakery.domain.Bakery;
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
	private final BreadPackageService breadPackageService;
	private final PaymentService paymentService;
	private final JwtTokenProvider jwtTokenProvider;

	public ReservationService(ReservationRepository reservationRepository, PaymentService paymentService, BreadPackageService breadPackageService,
							  JwtTokenProvider jwtTokenProvider) {
		this.reservationRepository = reservationRepository;
		this.paymentService = paymentService;
		this.breadPackageService = breadPackageService;
		this.jwtTokenProvider = jwtTokenProvider;
	}

	public void createReservation(ReservationDTO reservationDto, String orderId, String paymentKey, int amount, int quantity) {
		// 결제 정보 검증
		ResponseEntity<String> response = paymentService.check(orderId, paymentKey, amount);
		if (response.getStatusCode() != HttpStatus.OK) {
			throw new CustomException(ErrorCode.PAYMENT_NOT_VALID);
		}
		System.out.println("결제 정보 검증 완료");

		// 결제 가격 검증



		// orderId 추출 및 DTO에 추가
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode jsonNode = objectMapper.readTree(response.getBody());
			reservationDto.setPaymentKey(jsonNode.get("paymentKey").asText());        // 임시로 paymentKey 넣음. 원래는 orderId
			Reservation reservation = dtoToEntity(reservationDto);
			System.out.println("Entity로 변환 성공");
			System.out.println(reservation.getPaymentKey());
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
		ResponseEntity<String> response = paymentService.cancelPayment(reservation.getPaymentKey(), cancelReason);
		System.out.println(response.getBody());

		// 예약 정보 업데이트
		reservation.setCancelledAt(LocalDateTime.now());
		reservation.setStatus("CANCELED");
	}

	public void pickUp(long reservationId) {
		// 예약 정보 조회
		Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
		if (reservation == null) {
			throw new CustomException(ErrorCode.RESERVATION_NOT_FOUND);
		}

		// 예약 상태 업데이트
		reservation.setPickupAt(LocalDateTime.now());
		reservation.setStatus("PICKUP_COMPLETED");
	}

	public List<ReservationDTO> getUserReservationList(Long userId, LocalDate startDate, LocalDate endDate) {
		LocalDateTime startDateTime = startDate.atStartOfDay();
		LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

		List<Reservation> reservationList = reservationRepository.findByUser_UserIdAndCreatedAtBetween(userId, startDateTime, endDateTime);
		List<ReservationDTO> reservationDTOList = new ArrayList<>();
		for (Reservation reservation : reservationList) {
			reservationDTOList.add(entityToDto(reservation));
		}
		return reservationDTOList;
	}

	public List<ReservationDTO> getOwnerReservationList(String authorization, long bakeryId, LocalDate startDate, LocalDate endDate) {
		// TODO: bakeryId와 UserId로 소유자 검증 필요
//		String token = authorization.replace("Bearer ", "");
//		long userId = jwtTokenProvider.getUserIdFromToken(token);

		LocalDateTime startDateTime = startDate.atStartOfDay();
		LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

		List<Reservation> reservationList = reservationRepository.findByBakery_BakeryIdAndCreatedAtBetween(bakeryId, startDateTime, endDateTime);
		List<ReservationDTO> reservationDTOList = new ArrayList<>();
		for (Reservation reservation : reservationList) {
			reservationDTOList.add(entityToDto(reservation));
		}
		return reservationDTOList;
	}


	/* =========== 유틸성 메소드 ============= */

	private ReservationDTO entityToDto(Reservation reservation) {
		return ReservationDTO.builder()
			.reservationId(reservation.getReservationId())
			.userId(reservation.getUser().getUserId())
			.bakeryId(reservation.getBakery().getBakeryId())
			.breadPackageId(reservation.getBreadPackage().getPackageId())
			.quantity(reservation.getQuantity())
			.totalPrice(reservation.getTotalPrice())
			.createdAt(LocalDateTime.now())
			.status("RESERVATION_CONFIRMED")
			.paymentKey(reservation.getPaymentKey())
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
			.createdAt(reservationDto.getCreatedAt())
			.status(reservationDto.getStatus())
			.paymentKey(reservationDto.getPaymentKey())
			.build();
	}

	// 사용자와 예약 ID가 일치하는지 검증
	public boolean check(long reservationId, String authorization) {
		String token = authorization.replace("Bearer ", "");
		long userId = jwtTokenProvider.getUserIdFromToken(token);

		Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
		if (reservation == null) {
			throw new CustomException(ErrorCode.RESERVATION_NOT_FOUND);
		}
		return reservation.getUser().getUserId() == userId;
	}
}
