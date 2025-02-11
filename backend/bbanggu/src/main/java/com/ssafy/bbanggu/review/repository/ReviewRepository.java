package com.ssafy.bbanggu.review.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.bbanggu.review.domain.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
	boolean existsByReservation_ReservationId(Long reservationId);
}
