package com.ssafy.bbanggu.breadpackage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDateTime;
import java.util.Optional;

import com.ssafy.bbanggu.bakery.domain.Bakery;

@Repository
public interface BreadPackageRepository extends JpaRepository<BreadPackage, Long> {

	List<BreadPackage> findByBakery_BakeryIdAndDeletedAtIsNull(Long bakeryId);

	// BreadPackageRepository
	// ✅ 오늘 날짜의 빵꾸러미만 조회
	@Query("SELECT b FROM BreadPackage b WHERE b.bakery.bakeryId = :bakeryId AND DATE(b.createdAt) = CURRENT_DATE AND b.deletedAt IS NULL")
	BreadPackage findByBakeryIdAndToday(@Param("bakeryId") Long bakeryId);

	// 오늘 날짜의 빵꾸러미를 조회하되, 없다면 가장 최근 빵꾸러미 추출
	@Query("""
    SELECT b FROM BreadPackage b
    WHERE b.bakery.bakeryId = :bakeryId
    AND (
        (DATE(b.createdAt) = CURRENT_DATE AND b.deletedAt IS NULL)
        OR
        b.id = (
            SELECT b2.id
            FROM BreadPackage b2
            WHERE b2.bakery.bakeryId = :bakeryId
            ORDER BY
                CASE WHEN b2.deletedAt IS NULL THEN 0 ELSE 1 END,
                b2.createdAt DESC
            LIMIT 1
        )
    )
    """)
	BreadPackage findTodayOrLastBreadPackage(@Param("bakeryId") Long bakeryId);


	List<BreadPackage> findByBakery_BakeryIdAndCreatedAtBetweenAndDeletedAtIsNull(Long bakeryId, LocalDateTime startDate, LocalDateTime endDate);

	// 하루가 지난 빵꾸러미를 자동 삭제 (deleted_at 업데이트)
	@Transactional
	@Modifying
	@Query("UPDATE BreadPackage bp SET bp.deletedAt = :now WHERE bp.bakery.bakeryId = :bakeryId AND bp.deletedAt IS NULL")
	int deleteExpiredPackages(Long bakeryId, LocalDateTime now);

	// ✅ 오늘 날짜의 빵꾸러미가 존재하는지 확인
	@Query("SELECT b FROM BreadPackage b WHERE b.bakery.bakeryId = :bakeryId AND b.deletedAt IS NULL")
	Optional<BreadPackage> findTodayPackageByBakeryId(Long bakeryId);
}
