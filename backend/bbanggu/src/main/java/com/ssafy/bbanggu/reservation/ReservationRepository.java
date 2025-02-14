package com.ssafy.bbanggu.reservation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.bbanggu.breadpackage.BreadPackage;
import com.ssafy.bbanggu.reservation.dto.ReservationInfo;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
	List<Reservation> findByUser_UserIdAndCreatedAtBetween(long userId, LocalDateTime startDate, LocalDateTime endDate);
	List<Reservation> findByBakery_BakeryIdAndCreatedAtBetween(long bakeryId, LocalDateTime startDate, LocalDateTime endDate);
	Optional<Reservation> findByUser_UserIdAndBreadPackageAndStatus(long userId, BreadPackage breadPackage, String status);

	@Query("""
        SELECT new com.ssafy.bbanggu.reservation.dto.ReservationInfo(
            u.name, u.profileImageUrl, r.createdAt, r.status, r.quantity
        )
        FROM Reservation r
        JOIN r.user u
        WHERE r.bakery.bakeryId = :bakeryId
        AND DATE(r.createdAt) = CURRENT_DATE
        ORDER BY r.createdAt DESC
    """)
	List<ReservationInfo> findTodayReservationsByBakeryId(@Param("bakeryId") Long bakeryId);
}
