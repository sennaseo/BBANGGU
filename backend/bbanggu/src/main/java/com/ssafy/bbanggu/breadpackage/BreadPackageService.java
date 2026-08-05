package com.ssafy.bbanggu.breadpackage;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.bakery.domain.Bakery;
import com.ssafy.bbanggu.bakery.repository.BakeryRepository;
import com.ssafy.bbanggu.bread.Bread;
import com.ssafy.bbanggu.breadpackage.dto.BreadPackageDto;
import com.ssafy.bbanggu.breadpackage.dto.TodayBreadPackageDto;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.reservation.ReservationRepository;
import com.ssafy.bbanggu.user.domain.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BreadPackageService {

	private final BreadPackageRepository breadPackageRepository;
	private final BakeryRepository bakeryRepository;
	private final ReservationRepository reservationRepository;

	/**
	 * 빵꾸러미 생성
	 */
	public BreadPackageDto createPackage(CustomUserDetails userDetails, BreadPackageDto request) {
		Bakery bakery = bakeryRepository.findById(request.bakeryId())
			.orElseThrow(() -> new CustomException(ErrorCode.BAKERY_NOT_FOUND));
		log.info("✅ " + request.bakeryId() + "번 빵집이 존재합니다^^");

		if (!bakery.getUser().getUserId().equals(userDetails.getUserId())) {
			log.info("❗❗현재 로그인한 사용자의 아이디와 사장님의 아이디가 일치하지 않음❗❗\n"
				+ "로그인한 사용자 ID: " + userDetails.getUserId() + "\n사장님 ID: " + bakery.getUser().getUserId());
			throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
		}
		log.info("✅ 현재 로그인한 사용자가 해당 빵집의 사장님입니다^^");

		// ✅ 오늘 날짜의 빵꾸러미가 존재하는지 확인
		if (breadPackageRepository.findTodayPackageByBakeryId(request.bakeryId()).isPresent()) {
			log.warn("❌ 오늘 날짜의 빵꾸러미가 이미 존재합니다! 등록 불가 ❌");
			throw new CustomException(ErrorCode.TODAY_PACKATE_ALREADY_EXIST);
		}

		log.info("📌 현재 요청으로 들어온 빵꾸러미 정보\n1️⃣ bakery ID: " + request.bakeryId() + "\n2️⃣ price: " + request.price() +
			"\n3️⃣ quantity: " + request.quantity() + "\n4️⃣ name: " + request.name());
		// BreadPackage 객체 생성
		BreadPackage breadPackage = BreadPackage.builder()
			.bakery(bakery)
			.price(request.price())
			.initialQuantity(request.quantity())
			.quantity(request.quantity())
			.name(request.name())
			.createdAt(LocalDateTime.now())
			.build();

		// BreadPackage 저장
		BreadPackage savedBreadPackage = breadPackageRepository.save(breadPackage);
		log.info("🩵 생성된 빵꾸러미 DB에 저장 완료 🩵");

		// 저장된 BreadPackage를 BreadPackageDto로 변환하여 리턴
		return BreadPackageDto.from(savedBreadPackage);
	}


	/**
	 * 빵꾸러미 삭제 (논리적 삭제)
	 */
	public void deletePackage(Long packageId) {
		BreadPackage breadPackage = breadPackageRepository.findById(packageId)
			.orElseThrow(() -> new CustomException(ErrorCode.BREAD_PACKAGE_NOT_FOUND));
		if (breadPackage.getDeletedAt() != null) {
			throw new CustomException(ErrorCode.PACKAGE_ALREADY_DELETED);
		}

		// 논리적 삭제 처리
		breadPackage.setDeletedAt(LocalDateTime.now());
		breadPackageRepository.save(breadPackage);
	}


	/**
	 * 가게의 전체 빵꾸러미 조회
	 */
	public List<BreadPackageDto> getPackagesByBakeryId(Long bakeryId) {
		Bakery bakery = bakeryRepository.findByBakeryIdAndDeletedAtIsNull(bakeryId);
		if (bakery == null) {
			throw new CustomException(ErrorCode.BAKERY_NOT_FOUND);
		}

		List<BreadPackage> breadPackages = breadPackageRepository.findByBakery_BakeryIdAndDeletedAtIsNull(bakeryId);
		return breadPackages.stream()
			.map(BreadPackageDto::from)
			.collect(Collectors.toList());
	}


	/**
	 * 가게의 기간 내 빵꾸러미 전체 조회
	 */
	public List<BreadPackageDto> getPackagesByBakeryAndDate(Long bakeryId, LocalDateTime startDate, LocalDateTime endDate) {
		List<BreadPackage> breadPackages = breadPackageRepository.findByBakery_BakeryIdAndCreatedAtBetweenAndDeletedAtIsNull(bakeryId, startDate, endDate);
		if (breadPackages.isEmpty()) {
			throw new CustomException(ErrorCode.BREAD_PACKAGE_NOT_FOUND);
		}

		return breadPackages.stream()
			.map(BreadPackageDto::from)
			.collect(Collectors.toList());
	}


	/**
	 * 빵꾸러미 수정
	 */
	public BreadPackageDto updateBreadPackage(CustomUserDetails userDetails, long packageId, BreadPackageDto request) {
		BreadPackage breadPackage = breadPackageRepository.findById(packageId)
			.orElseThrow(() -> new CustomException(ErrorCode.BREAD_PACKAGE_NOT_FOUND));
		log.info("✅ {}번 빵꾸러미 존재 확인 완료", packageId);

		if (!breadPackage.getBakery().getUser().getUserId().equals(userDetails.getUserId())) {
			log.info("❗❗빵꾸러미 수정 권한 없음 -> 로그인한 사용자 ID: {}, 사장님 ID: {}❗❗",
				userDetails.getUserId(), breadPackage.getBakery().getUser().getUserId());
			throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
		}
		log.info("✅ 현재 로그인한 사용자가 해당 빵집의 사장님입니다^^");

		breadPackage.update(request.price(), request.quantity(), request.name());
		BreadPackage updatedPackage = breadPackageRepository.save(breadPackage);
		return BreadPackageDto.from(updatedPackage);
	}

	public int getBreadPackageQuantity(long breadPackageId) {
		BreadPackage breadPackage = breadPackageRepository.findById(breadPackageId).orElse(null);
		if (breadPackage == null) {
			return -1;
		}
		return breadPackage.getQuantity();
	}

	public TodayBreadPackageDto getTodayPackagesByBakeryId(CustomUserDetails userDetails, Long bakeryId) {
		Bakery bakery = bakeryRepository.findById(bakeryId)
			.orElseThrow(() -> new CustomException(ErrorCode.BAKERY_NOT_FOUND));
		log.info("✅ {}번 빵집 존재 확인 완료", bakeryId);

		if (!bakery.getUser().getUserId().equals(userDetails.getUserId())) {
			throw new CustomException(ErrorCode.USER_IS_NOT_OWNER);
		}
		log.info("✅ 현재 로그인한 사용자가 해당 빵집의 사장님입니다^^");

		LocalDate today = LocalDate.now();
		LocalDateTime startOfToday = today.atStartOfDay();
		LocalDateTime endOfToday = today.plusDays(1).atStartOfDay();

		BreadPackage breadPackage = breadPackageRepository.findByBakeryIdAndToday(bakeryId, startOfToday, endOfToday);
		if (breadPackage == null) {
			log.info("빵집 ID: {}의 오늘 빵꾸러미가 없습니다", bakeryId);
			// 빈 빵꾸러미 리턴
			return new TodayBreadPackageDto(
				null,    // packageId (Long)
				bakeryId,// bakeryId (Long)
				"",      // name (String)
				0,       // price (Integer)
				0,       // initialQuantity (Integer)
				0,       // quantity (Integer)
				0        // savedMoney (Integer)
			);
		}

		int nowQuantity = reservationRepository.getTotalPickedUpQuantityTodayByBakeryId(bakeryId);
		int savedMoney = breadPackage.getPrice() * nowQuantity;
		log.info("빵집 ID: {}, 픽업 완료 수량: {}, 절약 금액: {}", bakeryId, nowQuantity, savedMoney);

		return TodayBreadPackageDto.from(breadPackage, savedMoney);
	}

	/**
	 * 특정 가게의 하루 지난 빵꾸러미를 삭제 처리
	 * @param bakeryId 가게 ID
	 */
	@Transactional
	public void processExpiredPackages(Long bakeryId) {
		LocalDateTime now = LocalDateTime.now();
		int updatedCount = breadPackageRepository.deleteExpiredPackages(bakeryId, now);
		if (updatedCount > 0) {
			log.info("🗑️ [{}] 하루 지난 빵꾸러미 삭제 완료! (삭제된 패키지 수: {})", bakeryId, updatedCount);
		}
	}

	/**
	 * **매일 자정(00:00:00)에 실행**되는 스케줄러
	 */
	@Scheduled(cron = "0 0 0 * * *") // 매일 00:00:00에 실행
	public void scheduleExpiredPackagesProcessing() {
		// 특정 가게 ID 리스트 가져오기
		List<Long> bakeryIds = reservationRepository.findAllActiveBakeryIdsWithPackages();

		for (Long bakeryId : bakeryIds) {
			processExpiredPackages(bakeryId);
		}
	}
}
