package com.ssafy.bbanggu.breadpackage;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.bakery.domain.Bakery;
import com.ssafy.bbanggu.bakery.repository.BakeryRepository;
import com.ssafy.bbanggu.breadpackage.dto.BreadPackageDto;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
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

	public BreadPackageDto createPackage(CustomUserDetails userDetails, BreadPackageDto request) {
		Bakery bakery = bakeryRepository.findById(request.bakeryId())
			.orElseThrow(() -> new CustomException(ErrorCode.BAKERY_NOT_FOUND));
		log.info("✅ " + request.bakeryId() + "번 빵집이 존재합니다^^");

		if(!bakery.getUser().getUserId().equals(userDetails.getUserId())) {
			log.info("❗❗현재 로그인한 사용자의 아이디와 사장님의 아이디가 일치하지 않음❗❗\n"
				+ "로그인한 사용자 ID: " + userDetails.getUserId() + "\n사장님 ID: " + bakery.getUser().getUserId());
			throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
		}
		log.info("✅ 현재 로그인한 사용자가 해당 빵집의 사장님입니다^^");

		log.info("📌 현재 요청으로 들어온 빵꾸러미 정보\n1️⃣ bakery ID: " + request.bakeryId() + "\n2️⃣ price: " + request.price() +
			"\n3️⃣ quantity: " + request.quantity() + "\n4️⃣ name: " + request.name());
		// BreadPackage 객체 생성
		BreadPackage breadPackage = BreadPackage.builder()
			.bakery(bakery)
			.price(request.price())
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

	public boolean deletePackage(Long id) {
		Optional<BreadPackage> optionalPackage = breadPackageRepository.findById(id);
		if (optionalPackage.isPresent()) {
			BreadPackage breadPackage = optionalPackage.get();

			// 이미 삭제된 패키지인 경우 처리
			if (breadPackage.getDeletedAt() != null) {
				return false; // 이미 삭제된 빵꾸러미입니다.
			}

			// 논리적 삭제 처리
			breadPackage.setDeletedAt(LocalDateTime.now());
			breadPackageRepository.save(breadPackage);
			return true;
		}
		return false;
	}

	// 가게 ID로 모든 빵 패키지 리스트 조회 (논리적 삭제된 패키지 제외)

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

	// 베이커리 별 기간별 빵 패키지 조회
	public List<BreadPackageDto> getPackagesByBakeryAndDate(Long bakeryId, LocalDateTime startDate, LocalDateTime endDate) {
		List<BreadPackage> breadPackages = breadPackageRepository.findByBakery_BakeryIdAndCreatedAtBetweenAndDeletedAtIsNull(
			bakeryId, startDate, endDate);
		log.info("✅ 삭제되지 않은 가게들 중 기간에 해당하는 빵꾸러미 리스트 생성 완료 !!");
		return breadPackages.stream()
			.map(BreadPackageDto::from)
			.collect(Collectors.toList());
	}

	public int updateBreadPackage(long packageId, int quantity) {
		BreadPackage breadPackage = breadPackageRepository.findById(packageId).orElse(null);
		if (breadPackage == null) {
			throw new CustomException(ErrorCode.BREAD_PACKAGE_NOT_FOUND);
		}
		int updatedQuantity = breadPackage.getQuantity() + quantity;
		System.out.println("updatedQuantity: " + updatedQuantity);
		if (updatedQuantity < 0) {
			throw new CustomException(ErrorCode.BREAD_PACKAGE_QUANTITY_CONFLICT);
		}
		breadPackage.setQuantity(updatedQuantity);
		breadPackageRepository.save(breadPackage);
		return updatedQuantity;
	}

	public int getBreadPackageQuantity(long breadPackageId) {
		BreadPackage breadPackage = breadPackageRepository.findById(breadPackageId).orElse(null);
		if (breadPackage == null) {
			return -1;
		}
		return breadPackage.getQuantity();
	}
}
