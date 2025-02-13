package com.ssafy.bbanggu.reservation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.auth.security.JwtTokenProvider;
import com.ssafy.bbanggu.bakery.domain.Bakery;
import com.ssafy.bbanggu.breadpackage.BreadPackage;
import com.ssafy.bbanggu.breadpackage.BreadPackageRepository;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.payment.PaymentService;
import com.ssafy.bbanggu.reservation.dto.ReservationCreateRequest;
import com.ssafy.bbanggu.reservation.dto.ReservationDTO;
import com.ssafy.bbanggu.reservation.dto.checkQuantityRequest;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ReservationService {

	private final ReservationRepository reservationRepository;
	private final PaymentService paymentService;
	private final JwtTokenProvider jwtTokenProvider;
	private final BreadPackageRepository breadPackageRepository;
	private final UserRepository userRepository;

	public Map<String, Object> validateReservation(CustomUserDetails userDetails, checkQuantityRequest request) {
		BreadPackage breadPackage = breadPackageRepository.findById(request.breadPackageId())
			.orElseThrow(() -> new CustomException(ErrorCode.BREAD_PACKAGE_NOT_FOUND));
		log.info("✅ {}번 빵꾸러미가 존재함", request.breadPackageId());

		User user = userRepository.findById(userDetails.getUserId())
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		log.info("✅ {}번 사용자 검증 완료", userDetails.getUserId());

		if (request.quantity() > breadPackage.getQuantity()) {
			throw new CustomException(ErrorCode.QUANTITY_EXCEEDED);
		}
		log.info("✅ 예약 수량 초과여부 검증 완료");

		// 중복 예약 검증 (PENDING 상태 예약 존재 여부 체크)
		Optional<Reservation> existingReservation = reservationRepository.findByUser_UserIdAndBreadPackageAndStatus(
			userDetails.getUserId(), breadPackage, "PENDING");
		if (existingReservation.isPresent()) {
			throw new CustomException(ErrorCode.DUPLICATE_RESERVATION);
		}
		log.info("✅ 중복 예약 검증 완료");

		// 새로운 예약 객체 생성
		Reservation reservation = Reservation.builder()
			.user(user)
			.bakery(breadPackage.getBakery())
			.breadPackage(breadPackage)
			.quantity(request.quantity())
			.totalPrice(request.quantity() * breadPackage.getPrice())
			.status("PENDING")
			.paymentKey("PENDING_PAYMENT") // 임시 값 설정
			.build();

		// 빵꾸러미 pending 설정
		breadPackage.setPending(request.quantity());

		Reservation savedReservation = reservationRepository.save(reservation);
		log.info("🩵 빵꾸러미 예약 생성 완료 (PENDING) 🩵");

		Map<String, Object> response = new HashMap<>();
		response.put("reservationId", savedReservation.getReservationId());
		response.put("status", savedReservation.getStatus());

		return response;
	}

	public Map<String, Object> createReservation(CustomUserDetails userDetails, ReservationCreateRequest request) {
		Reservation reservation = reservationRepository.findById(request.reservationId())
			.orElseThrow(() -> new CustomException(ErrorCode.RESERVATION_NOT_FOUND));
		if (!reservation.getStatus().equals("PENDING")) {
			throw new CustomException(ErrorCode.UNVERIFIED_RESERVATION);
		}
		log.info("✅ 예약 상태 검증 완료");

		if (!reservation.getUser().getUserId().equals(userDetails.getUserId())) {
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}
		log.info("✅ {}번 사용자 검증 완료", userDetails.getUserId());

		// 결제 정보 검증
		ResponseEntity<String> response = paymentService.check(request.paymentKey());
		if (response.getStatusCode() != HttpStatus.OK) {
			throw new CustomException(ErrorCode.PAYMENT_NOT_VALID);
		}
		log.info("✅ 결제 정보 검증 완료");

		// 해당 예약의 상태를 "CONFIRMED"로 전환
		reservation.setStatus("CONFIRMED");
		Reservation savedReservation = reservationRepository.save(reservation);

		// 해당 빵꾸러미의 개수에 예약 빵꾸러미 개수 반영
		BreadPackage breadPackage = breadPackageRepository.findById(reservation.getBreadPackage().getPackageId())
			.orElseThrow(() -> new CustomException(ErrorCode.BREAD_PACKAGE_NOT_FOUND));

		int quantity_origin = breadPackage.getQuantity();
		breadPackage.setQuantity(quantity_origin - breadPackage.getPending());
		BreadPackage newBreadPackage = breadPackageRepository.save(breadPackage);
		log.info("✅ {}번 빵꾸러미 남은 개수: {}", newBreadPackage.getPackageId(), newBreadPackage.getQuantity());
		log.info("🩵 예약 성공 (CONFIRMED) 🩵");

		Map<String, Object> responseData = new HashMap<>();
		responseData.put("reservationId", savedReservation.getReservationId());
		responseData.put("status", savedReservation.getStatus());

		return responseData;

		// orderId 추출 및 DTO에 추가
		// try {
		// 	ObjectMapper objectMapper = new ObjectMapper();
		// 	JsonNode jsonNode = objectMapper.readTree(response.getBody());
		// 	request.setPaymentKey(request.paymentKey());        // 임시로 paymentKey 넣음. 원래는 orderId
		// 	Reservation reservation = dtoToEntity(request);
		// 	System.out.println("Entity로 변환 성공");
		// 	System.out.println(reservation.getPaymentKey());
		// 	reservationRepository.save(reservation);
		// 	log.info("🩵 예약 성공 🩵");
		// 	System.out.println("reservation save 성공");
		// } catch (JsonProcessingException e) {
		// 	throw new RuntimeException(e);
		// }
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
		// for (Reservation reservation : reservationList) {
		// 	reservationDTOList.add(entityToDto(reservation));
		// }
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
		// for (Reservation reservation : reservationList) {
		// 	reservationDTOList.add(entityToDto(reservation));
		// }
		return reservationDTOList;
	}


	/* =========== 유틸성 메소드 ============= */

	// private ReservationDTO entityToDto(Reservation reservation) {
	// 	return ReservationDTO.builder()
	// 		.reservationId(reservation.getReservationId())
	// 		.userId(reservation.getUser().getUserId())
	// 		.bakeryId(reservation.getBakery().getBakeryId())
	// 		.breadPackageId(reservation.getBreadPackage().getPackageId())
	// 		.quantity(reservation.getQuantity())
	// 		.totalPrice(reservation.getTotalPrice())
	// 		.reservedPickupTime(reservation.getReservedPickupTime())
	// 		.createdAt(LocalDateTime.now())
	// 		.status("RESERVATION_CONFIRMED")
	// 		.paymentKey(reservation.getPaymentKey())
	// 		.build();
	// }

	// private Reservation dtoToEntity(ReservationCreateRequest reservationDto) {
	// 	User user = User.builder()
	// 		.userId(reservationDto.getUserId())
	// 		.build();
	//
	// 	Bakery bakery = Bakery.builder()
	// 		.bakeryId(reservationDto.getBakeryId())
	// 		.build();
	//
	// 	BreadPackage breadPackage = BreadPackage.builder()
	// 		.packageId(reservationDto.getBreadPackageId())
	// 		.build();
	//
	// 	return Reservation.builder()
	// 		.user(user)
	// 		.bakery(bakery)
	// 		.breadPackage(breadPackage)
	// 		.quantity(reservationDto.getQuantity())
	// 		.totalPrice(reservationDto.getTotalPrice())
	// 		.reservedPickupTime(reservationDto.getReservedPickupTime())
	// 		.createdAt(reservationDto.getCreatedAt())
	// 		.status(reservationDto.getStatus())
	// 		.paymentKey(reservationDto.getPaymentKey())
	// 		.build();
	// }

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
