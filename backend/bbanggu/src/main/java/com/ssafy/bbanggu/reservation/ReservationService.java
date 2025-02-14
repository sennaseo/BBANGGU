package com.ssafy.bbanggu.reservation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.ssafy.bbanggu.bakery.domain.Bakery;
import com.ssafy.bbanggu.bakery.dto.PickupTimeDto;
import com.ssafy.bbanggu.bakery.repository.BakeryRepository;
import com.ssafy.bbanggu.bakery.service.BakeryPickupService;
import com.ssafy.bbanggu.breadpackage.BreadPackageService;

import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.auth.security.JwtTokenProvider;
import com.ssafy.bbanggu.breadpackage.BreadPackage;
import com.ssafy.bbanggu.breadpackage.BreadPackageRepository;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.payment.PaymentService;
import com.ssafy.bbanggu.reservation.dto.ReservationCancelRequest;
import com.ssafy.bbanggu.reservation.dto.ReservationCreateRequest;
import com.ssafy.bbanggu.reservation.dto.ReservationDTO;
import com.ssafy.bbanggu.reservation.dto.ReservationForOwner;
import com.ssafy.bbanggu.reservation.dto.ReservationInfo;
import com.ssafy.bbanggu.reservation.dto.ReservationResponse;
import com.ssafy.bbanggu.reservation.dto.ValidReservationRequest;
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
	private final BreadPackageService breadPackageService;
	private final PaymentService paymentService;
	private final JwtTokenProvider jwtTokenProvider;
	private final BreadPackageRepository breadPackageRepository;
	private final UserRepository userRepository;
	private final BakeryRepository bakeryRepository;
	private final BakeryPickupService bakeryPickupService;

	/**
	 * 예약 검증 메서드 (PENDING)
	 */
	public Map<String, Object> validateReservation(CustomUserDetails userDetails, ValidReservationRequest request) {
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
			.totalPrice(request.quantity() * (breadPackage.getPrice() / 2))
			.status("PENDING")
			.createdAt(LocalDateTime.now())
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


	/**
	 * 예약 생성 메서드 (CONFIRMED)
	 */
	public Map<String, Object> createReservation(CustomUserDetails userDetails, ReservationCreateRequest request) {
		Reservation reservation = reservationRepository.findById(request.reservationId())
			.orElseThrow(() -> new CustomException(ErrorCode.RESERVATION_NOT_FOUND));
		if (!reservation.getStatus().equals("PENDING")) {
			throw new CustomException(ErrorCode.UNVERIFIED_RESERVATION);
		}
		log.info("✅ 예약 상태 검증 완료");

		if (!reservation.getUser().getUserId().equals(userDetails.getUserId())) {
			throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
		}
		log.info("✅ {}번 사용자 검증 완료", userDetails.getUserId());

		// 결제 정보 검증
		ResponseEntity<String> response = paymentService.check(request.paymentKey(), request.amount(), request.orderId());
		if (response.getStatusCode() != HttpStatus.OK) {
			throw new CustomException(ErrorCode.PAYMENT_NOT_VALID);
		}
		log.info("✅ 결제 정보 검증 완료");

		// 해당 예약의 상태를 "CONFIRMED"로 전환
		reservation.setStatus("CONFIRMED");
		reservation.setPaymentKey(request.paymentKey());
		reservation.setCreatedAt(LocalDateTime.now());
		Reservation savedReservation = reservationRepository.save(reservation);

		// 해당 빵꾸러미의 개수에 예약 빵꾸러미 개수 반영
		BreadPackage breadPackage = breadPackageRepository.findById(reservation.getBreadPackage().getPackageId())
			.orElseThrow(() -> new CustomException(ErrorCode.BREAD_PACKAGE_NOT_FOUND));

		int quantity_origin = breadPackage.getQuantity();
		breadPackage.setQuantity(quantity_origin - breadPackage.getPending());
		breadPackage.setPending(0);
		BreadPackage newBreadPackage = breadPackageRepository.save(breadPackage);
		log.info("✅ {}번 빵꾸러미 남은 개수: {} -> {}개", newBreadPackage.getPackageId(), quantity_origin, newBreadPackage.getQuantity());
		log.info("🩵 예약 성공 (CONFIRMED) 🩵");

		Map<String, Object> responseData = new HashMap<>();
		responseData.put("reservationId", savedReservation.getReservationId());
		responseData.put("status", savedReservation.getStatus());

		return responseData;
	}


	/**
	 * 예약 취소 메서드 (CANCELED)
	 */
	public Map<String, Object> cancelReservation(CustomUserDetails userDetails, ReservationCancelRequest request) {
		// 예약 정보 조회
		Reservation reservation = reservationRepository.findById(request.reservationId())
			.orElseThrow(() -> new CustomException(ErrorCode.RESERVATION_NOT_FOUND));

		if (reservation.getStatus().equals("CANCELED")) {
			throw new CustomException(ErrorCode.RESERVATION_ALREADY_CANCELED);
		}
		log.info("✅ 취소되지 않은 {}번 예약이 존재함", request.reservationId());

		if (!reservation.getUser().getUserId().equals(userDetails.getUserId())) {
			throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
		}
		log.info("✅ 현재 로그인한 사용자와 예약한 사용자가 일치함");

		// 결제 취소
		ResponseEntity<String> response = paymentService.cancelPayment(reservation.getPaymentKey(), request.cancelReason());
		System.out.println(response.getBody());

		// 해당 예약의 상태를 "CANCELED"로 변경
		reservation.setStatus("CANCELED");
		reservation.setCancelledAt(LocalDateTime.now());
		Reservation savedReservation = reservationRepository.save(reservation);

		// 해당 빵꾸러미의 개수에 취소된 예약 빵꾸러미 개수 반영
		BreadPackage breadPackage = breadPackageRepository.findById(reservation.getBreadPackage().getPackageId())
			.orElseThrow(() -> new CustomException(ErrorCode.BREAD_PACKAGE_NOT_FOUND));

		int quantity_origin = breadPackage.getQuantity();
		breadPackage.setQuantity(quantity_origin + reservation.getQuantity());
		BreadPackage newBreadPackage = breadPackageRepository.save(breadPackage);
		log.info("✅ {}번 빵꾸러미 남은 개수: {} -> {}개", newBreadPackage.getPackageId(), quantity_origin, newBreadPackage.getQuantity());
		log.info("🩵 예약 취소 성공 (CANCELED) 🩵");

		Map<String, Object> responseData = new HashMap<>();
		responseData.put("reservationId", savedReservation.getReservationId());
		responseData.put("status", savedReservation.getStatus());

		return responseData;
	}


	/**
	 * 예약 완료 처리 메서드 (COMPLETED)
	 */
	public Map<String, Object> pickUp(long reservationId, CustomUserDetails userDetails) {
		// 예약 정보 조회
		Reservation reservation = reservationRepository.findById(reservationId)
			.orElseThrow(() -> new CustomException(ErrorCode.RESERVATION_NOT_FOUND));
		if (reservation.getStatus().equals("COMPLETED")) {
			throw new CustomException(ErrorCode.RESERVATION_ALREADY_COMPLETED);
		} else if (reservation.getStatus().equals("CANCELED")) {
			throw new CustomException(ErrorCode.RESERVATION_ALREADY_CANCELED);
		}
		log.info("✅ 결제가 완료된 {}번 예약이 존재함", reservationId);

		if (!reservation.getBakery().getUser().getUserId().equals(userDetails.getUserId())) {
			throw new CustomException(ErrorCode.NOT_BAKERY_OWNER);
		}
		log.info("✅ 현재 로그인한 사용자와 가게 사장님이 일치함");

		// 예약 상태 업데이트
		reservation.setStatus("COMPLETED");
		reservation.setPickupAt(LocalDateTime.now());
		Reservation savedReservation = reservationRepository.save(reservation);
		log.info("🩵 빵꾸러미 판매 성공 (COMPLETED) 🩵");

		if (reservation.getBreadPackage().getQuantity() == 0) {
			reservation.getBreadPackage().setDeletedAt(LocalDateTime.now());
			log.info("💖 오늘 빵꾸러미 매진 (DELETED) 💖");
		}

		Map<String, Object> responseData = new HashMap<>();
		responseData.put("reservationId", savedReservation.getReservationId());
		responseData.put("status", savedReservation.getStatus());

		return responseData;
	}


	/**
	 * 사용자 예약 조회 메서드
	 */
	public List<ReservationResponse> getUserReservationList(CustomUserDetails userDetails, LocalDate startDate, LocalDate endDate) {
		LocalDateTime startDateTime = startDate.atStartOfDay();
		LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

		List<Reservation> reservationList = reservationRepository.findByUser_UserIdAndCreatedAtBetween(userDetails.getUserId(), startDateTime, endDateTime);
		List<ReservationResponse> reservationDTOList = new ArrayList<>();
		// for (Reservation reservation : reservationList) {
		// 	reservationDTOList.add(entityToDto(reservation));
		// }
		return reservationDTOList;
	}

	/**
	 *  사장님 오늘의 예약 조회 메서드
	 */
	public ReservationForOwner getTodayOwnerReservations(CustomUserDetails userDetails, long bakeryId) {
		User user = userRepository.findById(userDetails.getUserId())
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		Bakery bakery = bakeryRepository.findById(bakeryId)
			.orElseThrow(() -> new CustomException(ErrorCode.BAKERY_NOT_FOUND));
		log.info("✅ {}번 빵집이 존재함", bakeryId);

		if (!bakery.getUser().getUserId().equals(user.getUserId())) {
			throw new CustomException(ErrorCode.USER_NOT_BAKERY_OWNER);
		}
		log.info("✅ 현재 로그인한 {}번 유저는 {}번 빵집의 사장님임", user.getUserId(), bakeryId);

		List<ReservationInfo> reservationList = reservationRepository.findTodayReservationsByBakeryId(bakeryId);
		PickupTimeDto endTime = bakeryPickupService.getPickupTimetable(bakeryId);
		ReservationForOwner response = new ReservationForOwner(reservationList, reservationList.size(), endTime.getEndTime());
		return response;
	}

	/**
	 * 사장님 예약 조회 메서드
	 */
	public List<ReservationResponse> getOwnerReservationList(CustomUserDetails userDetails, long bakeryId, LocalDate startDate, LocalDate endDate) {
		// TODO: bakeryId와 UserId로 소유자 검증 필요
//		String token = authorization.replace("Bearer ", "");
//		long userId = jwtTokenProvider.getUserIdFromToken(token);

		LocalDateTime startDateTime = startDate.atStartOfDay();
		LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

		List<Reservation> reservationList = reservationRepository.findByBakery_BakeryIdAndCreatedAtBetween(bakeryId, startDateTime, endDateTime);
		List<ReservationResponse> reservationDTOList = new ArrayList<>();
		// for (Reservation reservation : reservationList) {
		// 	reservationDTOList.add(entityToDto(reservation));
		// }
		return reservationDTOList;
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
