package com.ssafy.bbanggu.favorite;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.bakery.domain.Bakery;
import com.ssafy.bbanggu.bakery.dto.BakeryDetailDto;
import com.ssafy.bbanggu.bakery.dto.BakeryDto;
import com.ssafy.bbanggu.bakery.dto.PickupTimeDto;
import com.ssafy.bbanggu.bakery.repository.BakeryRepository;
import com.ssafy.bbanggu.bakery.service.BakeryPickupService;
import com.ssafy.bbanggu.bakery.service.BakeryService;
import com.ssafy.bbanggu.breadpackage.BreadPackage;
import com.ssafy.bbanggu.breadpackage.BreadPackageRepository;
import com.ssafy.bbanggu.breadpackage.BreadPackageService;
import com.ssafy.bbanggu.breadpackage.dto.BreadPackageDto;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.favorite.dto.BestBakeryDto;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class FavoriteService {

	private final FavoriteRepository favoriteRepository;
	private final BakeryService bakeryService;
	private final UserRepository userRepository;
	private final BakeryRepository bakeryRepository;
	private final BakeryPickupService bakeryPickupService;
	private final BreadPackageRepository breadPackageRepository;

	// 좋아요 추가
	@Transactional
	public void addFavorite(CustomUserDetails userDetails, Long bakeryId) {
		User user = userRepository.findById(userDetails.getUserId())
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
		log.info("✅ {}번 사용자 검증 완료", userDetails.getUserId());

		Bakery bakery = bakeryRepository.findById(bakeryId)
			.orElseThrow(() -> new CustomException(ErrorCode.BAKERY_NOT_FOUND));
		log.info("✅ {}번 빵집 검증 완료", bakery.getBakeryId());

		// 이미 좋아요한 상태인지 확인
		if (favoriteRepository.existsByUser_UserIdAndBakery_BakeryId(user.getUserId(), bakeryId)) {
			throw new CustomException(ErrorCode.ALREADY_FAVORITE);
		}
		log.info("✅ 사용자가 아직 {}번 빵집의 좋아요를 누르지 않음", bakery.getBakeryId());

		// 새로 좋아요 추가
		Favorite favorite = Favorite.builder()
			.user(user)
			.bakery(bakery)
			.build();

		favoriteRepository.save(favorite);
		log.info("🩵 좋아요 누르기 완료 🩵");
	}

	// 좋아요 취소
	@Transactional
	public void removeFavorite(Long userId, Long bakeryId) {
		if (!bakeryRepository.existsById(bakeryId)) {
			throw new CustomException(ErrorCode.BAKERY_NOT_FOUND);
		}

		Favorite favorite = favoriteRepository.findByUser_UserIdAndBakery_BakeryId(userId, bakeryId)
			.orElseThrow(() -> new CustomException(ErrorCode.BAKERY_NOT_FAVORITE));

		favoriteRepository.delete(favorite);
	}

	// 유저가 좋아요한 모든 가게 조회
	@Transactional(readOnly = true)
	public Page<BakeryDetailDto> findAllFavorites(CustomUserDetails userDetails, Pageable pageable) {
		// 사용자 위치 정보 추출
		final Double userLat = Optional.ofNullable(userDetails)
			.filter(u -> u.getLatitude() != 0.0)
			.map(CustomUserDetails::getLatitude)
			.orElse(null);

		final Double userLng = Optional.ofNullable(userDetails)
			.filter(u -> u.getLongitude() != 0.0)
			.map(CustomUserDetails::getLongitude)
			.orElse(null);

		// 좋아요 누른 가게 아이디 조회
		List<Favorite> favorites = favoriteRepository.findByUser_UserId(userDetails.getUserId());
		List<Long> bakeryIds = favorites.stream()
			.map(f -> f.getBakery().getBakeryId())
			.toList();

		if (bakeryIds.isEmpty())
			return Page.empty();

		Page<Bakery> bakeries = bakeryRepository.findByBakeryIdInAndDeletedAtIsNull(bakeryIds, pageable);

		List<BakeryDetailDto> bakeryDetailDtos = bakeries.getContent().stream()
			.map(b -> {
				double distance = (userLat == null || userLng == null) ? 0.0
					: bakeryService.calculateDistance(userLat, userLng, b.getLatitude(), b.getLongitude());
				boolean is_liked = favoriteRepository.existsByUser_UserIdAndBakery_BakeryId(userDetails.getUserId(), b.getBakeryId());
				PickupTimeDto pickupTime = bakeryPickupService.getPickupTimetable(b.getBakeryId());
				BreadPackage breadPackage = breadPackageRepository.findByBakeryIdAndToday(b.getBakeryId());
				int price = 0;
				if (breadPackage != null) {
					price = breadPackage.getPrice();
				}
				return BakeryDetailDto.from(b, distance, is_liked, pickupTime, price);
			})
			.toList();

		return new PageImpl<>(bakeryDetailDtos, pageable, bakeries.getTotalElements());
	}

	@Transactional(readOnly = true)
	public List<BestBakeryDto> getTop10BestBakeries(CustomUserDetails userDetails) {
		// 사용자 위치 정보 추출 (로그인 안 했으면 기본값 null)
		final Double userLat = (userDetails != null && userDetails.getLatitude() != 0.0)
			? userDetails.getLatitude()
			: null;

		final Double userLng = (userDetails != null && userDetails.getLongitude() != 0.0)
			? userDetails.getLongitude()
			: null;

		List<BestBakeryDto> response = new ArrayList<>();

		// 로그인하지 않은 사용자도 조회 가능하도록 예외 방지
		if (userLat == null || userLng == null) {
			List<Bakery> list = bakeryRepository.findTop10ByFavorites();

			for (Bakery b : list) {
				BreadPackage bpackage = breadPackageRepository.findTodayOrLastBreadPackage(b.getBakeryId());
				String packageName = null;
				if (bpackage != null) {
					packageName = bpackage.getName();
				}

				boolean is_liked = false;
				if (userDetails != null) {
					is_liked = favoriteRepository.existsByUser_UserIdAndBakery_BakeryId(userDetails.getUserId(), b.getBakeryId());
				}
				response.add(BestBakeryDto.from(b.getBakeryId(), packageName, b.getName(), is_liked));
			}
		} else {
			List<Bakery> list = bakeryRepository.findBestBakeriesByLocation(userLat, userLng);

			for (Bakery b : list) {
				BreadPackage bpackage = breadPackageRepository.findTodayOrLastBreadPackage(b.getBakeryId());
				String packageName = null;
				if (bpackage != null) {
					packageName = bpackage.getName();
				}

				log.info("🩵 user_id: {}, bakery_id: {}", userDetails.getUserId(), b.getBakeryId());
				boolean is_liked = favoriteRepository.existsByUser_UserIdAndBakery_BakeryId(userDetails.getUserId(), b.getBakeryId());
				response.add(BestBakeryDto.from(b.getBakeryId(), packageName, b.getName(), is_liked));
			}
		}

		return response;
	}


	public int getBakeryFavorCount(long bakeryId) {
		return favoriteRepository.countByBakery_BakeryId(bakeryId);
	}
}
