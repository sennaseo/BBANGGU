package com.ssafy.bbanggu.reservation;

import com.ssafy.bbanggu.bakery.Bakery;
import com.ssafy.bbanggu.breadpackage.BreadPackage;
import com.ssafy.bbanggu.breadpackage.BreadPackageRepository;
import com.ssafy.bbanggu.breadpackage.BreadPackageService;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.user.domain.User;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Transactional
public class ReservationService {

	private final ReservationRepository reservationRepository;
	private final BreadPackageService breadPackageService;

	public ReservationService(ReservationRepository reservationRepository, BreadPackageService breadPackageService) {
		this.reservationRepository = reservationRepository;
		this.breadPackageService = breadPackageService;
	}

	public long createReservation(ReservationDTO reservationDTO) {
		int quantity = breadPackageService.getBreadPackageQuantity(reservationDTO.getBreadPackageId());
		if (quantity < 0) {
			// 패키지가 존재하지 않습니다.
		} else if (quantity == 0) {
			// 재고가 소진되었습니다.
		} else if (quantity < reservationDTO.getQuantity()) {
			// 재고가 부족합니다.
			// 남은 재고 수 반환
		}
		Reservation reservation = DTOToEntity(reservationDTO);
		Reservation createdReservation = reservationRepository.save(reservation);
		return createdReservation.getReservationId();
	}
	

	public void makePayment(){

	}

	/* =========== 변환 메소드 ============= */

	private ReservationDTO entityToDTO(Reservation reservation) {
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
			.build();
	}

	private Reservation DTOToEntity(ReservationDTO reservationDTO) {
		User user = User.builder()
			.userId(reservationDTO.getUserId())
			.build();

		Bakery bakery = Bakery.builder()
			.bakeryId(reservationDTO.getBakeryId())
			.build();

		BreadPackage breadPackage = BreadPackage.builder()
			.packageId(reservationDTO.getBreadPackageId())
			.build();

		return Reservation.builder()
			.user(user)
			.bakery(bakery)
			.breadPackage(breadPackage)
			.quantity(reservationDTO.getQuantity())
			.totalPrice(reservationDTO.getTotalPrice())
			.reservedPickupTime(reservationDTO.getReservedPickupTime())
			.createdAt(reservationDTO.getCreatedAt())
			.status(reservationDTO.getStatus())
			.build();
	}
}
