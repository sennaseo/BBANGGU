package com.ssafy.bbanggu.breadpackage.scheduler;  // ✅ 변경된 패키지 경로

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

import com.ssafy.bbanggu.breadpackage.BreadPackageRepository;

@Slf4j
@Component
@RequiredArgsConstructor
public class BreadPackageCleanupScheduler {

	private final BreadPackageRepository breadPackageRepository;

	@Scheduled(cron = "0 0 1 * * ?")  // 매일 새벽 1시에 실행
	@Transactional
	public void markExpiredPackagesAsDeleted() {
		log.info("🕒 자동 삭제 배치 실행 중...");
		int updatedRows = breadPackageRepository.markExpiredPackagesAsDeleted(LocalDateTime.now().minusDays(1));
		log.info("✅ {}개의 빵꾸러미가 자동 삭제되었습니다.", updatedRows);
	}
}
