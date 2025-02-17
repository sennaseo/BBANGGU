package com.ssafy.bbanggu.saving.repository;

import com.ssafy.bbanggu.saving.domain.EchoSaving;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EchoSavingRepository extends JpaRepository<EchoSaving, Long> {
	EchoSaving findByUser_UserId(Long userId);

	@Query("SELECT COALESCE(SUM(e.savedMoney), 0) FROM EchoSaving e")
	int sumTotalSavedMoney();

	@Query("SELECT COALESCE(SUM(e.reducedCo2e), 0) FROM EchoSaving e")
	int sumTotalReducedCo2e();
}
