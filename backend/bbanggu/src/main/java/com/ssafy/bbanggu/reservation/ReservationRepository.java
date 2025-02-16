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
import com.ssafy.bbanggu.reservation.dto.ReservationResponse;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

	@Query("""
        SELECT new com.ssafy.bbanggu.reservation.dto.ReservationResponse(
            r.bakery.bakeryId, r.bakery.name, r.createdAt, r.pickupAt, r.status
        )
        FROM Reservation r
        JOIN r.user u
        WHERE r.user.userId = :userId
        AND r.createdAt BETWEEN :startDate AND :endDate
        ORDER BY r.createdAt DESC
    """)
	List<ReservationResponse> findByUser_UserIdAndCreatedAtBetween(long userId, LocalDateTime startDate, LocalDateTime endDate);
	List<Reservation> findByBakery_BakeryIdAndCreatedAtBetween(long bakeryId, LocalDateTime startDate, LocalDateTime endDate);
	Optional<Reservation> findByUser_UserIdAndBreadPackageAndStatus(long userId, BreadPackage breadPackage, String status);

	@Query("""
        SELECT new com.ssafy.bbanggu.reservation.dto.ReservationInfo(
            r.reservationId, u.name, u.profileImageUrl, u.phone, r.createdAt, r.status, r.quantity
        )
        FROM Reservation r
        JOIN r.user u
        WHERE r.bakery.bakeryId = :bakeryId
        AND DATE(r.createdAt) = CURRENT_DATE
        ORDER BY r.createdAt DESC
    """)
	List<ReservationInfo> findTodayReservationsByBakeryId(@Param("bakeryId") Long bakeryId);

	// ✅ 특정 가게(bakeryId)의 오늘 픽업 완료된 예약들의 구매 수량 총합 구하기
	@Query("SELECT COALESCE(SUM(r.quantity), 0) FROM Reservation r " +
		"WHERE r.bakery.bakeryId = :bakeryId " +
		"AND DATE(r.pickupAt) = CURRENT_DATE " +
		"AND r.pickupAt IS NOT NULL")
	int getTotalPickedUpQuantityTodayByBakeryId(Long bakeryId);
}
