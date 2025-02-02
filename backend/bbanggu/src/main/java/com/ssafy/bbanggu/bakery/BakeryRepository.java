package com.ssafy.bbanggu.bakery;

import org.springframework.data.jpa.repository.JpaRepository;
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

	List<Bakery> findByNameContainingAndDeletedAtIsNull(String keyword);

	// // 사용자 ID로 가게 목록 조회
    // List<Bakery> findByUserId(Long userId);
}
