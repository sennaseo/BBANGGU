package com.ssafy.bbanggu.bread;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BreadRepository extends JpaRepository<Bread, Long> {
	List<Bread> findByBakery_BakeryIdAndDeletedAtIsNull(long bakeryId);

}
