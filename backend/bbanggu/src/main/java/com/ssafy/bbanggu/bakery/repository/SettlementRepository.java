package com.ssafy.bbanggu.bakery.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.bbanggu.bakery.domain.Settlement;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, Long> {
	Optional<Settlement> findByBakery_BakeryId(Long bakeryId);

	Optional<Settlement> findByUser_UserId(Long userId);
}
