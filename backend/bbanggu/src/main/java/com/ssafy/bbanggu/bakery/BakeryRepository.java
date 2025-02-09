package com.ssafy.bbanggu.bakery;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface BakeryRepository extends JpaRepository<Bakery, Long> {
    // 키워드로 가게 이름 검색
    List<Bakery> findByNameContaining(String keyword);

	boolean existsByBusinessRegistrationNumber(String businessRegistrationNumber);

	boolean existsByName(String name);

	boolean existsByBusinessRegistrationNumberAndBakeryIdNot(String businessRegistrationNumber, Long id);

	boolean existsByNameAndBakeryIdNot(String name, Long id);

	List<Bakery> findByDeletedAtIsNull();

	Bakery findByBakeryIdAndDeletedAtIsNull(Long id);

	Page<Bakery> findByBakeryIdInAndDeletedAtIsNull(List<Long> bakeryIds, Pageable pageable);

	Page<Bakery> findAllByDeletedAtIsNull(Pageable pageable);

	@Query("SELECT b FROM Bakery b WHERE (LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%')) "
		+ "OR LOWER(b.addressRoad) LIKE LOWER(CONCAT('%', :keyword, '%')) "
		+ "OR LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND b.deletedAt IS NULL")
	Page<Bakery> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

	@Query("SELECT b FROM Bakery b " +
		"LEFT JOIN b.favorites f " +
		"GROUP BY b.bakeryId " +
		"ORDER BY COUNT(f) DESC " +
		"LIMIT 10")
	List<Bakery> findTop10ByFavorites();

	@Query("SELECT b FROM Bakery b " +
		"LEFT JOIN b.favorites f " +
		"WHERE FUNCTION('ST_Distance_Sphere', " +
		"    POINT(b.longitude, b.latitude), " +
		"    POINT(:longitude, :latitude)) <= 5000 " +
		"GROUP BY b.bakeryId " +
		"ORDER BY COUNT(f) DESC " +
		"LIMIT 10")
	List<Bakery> findBestBakeriesByLocation(@Param("latitude") double userLat, @Param("longitude") double userLng);

	Page<Bakery> findByNameContainingAndDeletedAtIsNull(String keyword, Pageable pageable);

	// // 사용자 ID로 가게 목록 조회
    // List<Bakery> findByUserId(Long userId);
}
