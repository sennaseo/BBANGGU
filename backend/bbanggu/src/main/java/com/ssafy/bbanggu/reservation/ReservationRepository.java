package com.ssafy.bbanggu.reservation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
	List<Reservation> findByUser_UserId(long userId);
}
