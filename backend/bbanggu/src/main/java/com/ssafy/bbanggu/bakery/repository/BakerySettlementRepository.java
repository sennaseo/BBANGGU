package com.ssafy.bbanggu.bakery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.bbanggu.bakery.domain.Settlement;

@Repository
public interface BakerySettlementRepository extends JpaRepository<Settlement, Long> {

}
