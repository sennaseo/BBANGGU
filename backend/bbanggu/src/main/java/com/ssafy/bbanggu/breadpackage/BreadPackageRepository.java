package com.ssafy.bbanggu.breadpackage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
	Optional<BreadPackage> findByBakeryIdAndToday(@Param("bakeryId") Long bakeryId);

	List<BreadPackage> findByBakery_BakeryIdAndCreatedAtBetweenAndDeletedAtIsNull(Long bakeryId, LocalDateTime startDate, LocalDateTime endDate);

}
