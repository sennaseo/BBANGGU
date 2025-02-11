package com.ssafy.bbanggu.review.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.bbanggu.bakery.domain.Bakery;
import com.ssafy.bbanggu.review.domain.Review;
import com.ssafy.bbanggu.user.domain.User;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
	boolean existsByReservation_ReservationId(Long reservationId);
	List<Review> findByUserAndDeletedAtIsNullOrderByCreatedAtDesc(User user);
	List<Review> findByBakeryAndDeletedAtIsNullOrderByCreatedAtDesc(Bakery bakery);

}
