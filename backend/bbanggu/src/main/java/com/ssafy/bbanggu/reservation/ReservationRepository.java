package com.ssafy.bbanggu.reservation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
	List<Reservation> findByUser_UserIdAndReservationCreatedAtBetween(long userId, LocalDateTime startDate, LocalDateTime endDate);

	List<Reservation> findByBakery_BakeryIdAndReservationCreatedAtBetween(long bakeryId, LocalDateTime startDate, LocalDateTime endDate);

}
