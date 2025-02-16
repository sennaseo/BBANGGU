package com.ssafy.bbanggu.reservation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

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

	// 가게별 노쇼 예약 조회 (status가 CANCEL이 아니고, pickup_at이 NULL인 예약)
	@Query("SELECT r FROM Reservation r WHERE r.bakery.bakeryId = :bakeryId AND r.status != 'CANCEL' AND r.pickupAt IS NULL")
	List<Reservation> findMissedReservations(Long bakeryId);

	// 가게별 노쇼 예약을 자동 픽업 처리 (pickup_at을 현재 시간으로 업데이트)
	@Transactional
	@Modifying
	@Query("UPDATE Reservation r SET r.pickupAt = :now, r.status = :status WHERE r.bakery.bakeryId = :bakeryId AND r.status != 'CANCEL' AND r.pickupAt IS NULL")
	int updateMissedReservations(Long bakeryId, LocalDateTime now, String status);

	// 오늘 빵꾸러미를 등록한 모든 가게의 아이디 조회
	@Query("SELECT DISTINCT bp.bakery.bakeryId FROM BreadPackage bp WHERE bp.deletedAt IS NULL")
	List<Long> findAllActiveBakeryIdsWithPackages();
}
