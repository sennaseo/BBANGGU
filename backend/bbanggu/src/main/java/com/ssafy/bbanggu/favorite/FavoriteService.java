package com.ssafy.bbanggu.favorite;

import java.util.List;
import java.util.stream.Collectors;

import com.ssafy.bbanggu.bakery.Bakery;
import com.ssafy.bbanggu.bakery.BakeryRepository;
import com.ssafy.bbanggu.bakery.dto.BakeryDetailDto;
import com.ssafy.bbanggu.bakery.service.BakeryService;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FavoriteService {

	private final FavoriteRepository favoriteRepository;
	private final BakeryService bakeryService;
	private final UserRepository userRepository;
	private final BakeryRepository bakeryRepository;

	// 좋아요 추가
	@Transactional
	public void addFavorite(Long userId, Long bakeryId) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		Bakery bakery = bakeryRepository.findById(bakeryId)
			.orElseThrow(() -> new CustomException(ErrorCode.BAKERY_NOT_FOUND));

		// 이미 좋아요한 상태인지 확인
		if (favoriteRepository.existsByUser_UserIdAndBakery_BakeryId(userId, bakeryId)) {
			throw new CustomException(ErrorCode.ALREADY_FAVORITE);
		}

		// 새로 좋아요 추가
		Favorite favorite = Favorite.builder()
			.user(user)
			.bakery(bakery)
			.build();

		favoriteRepository.save(favorite);
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
	public Page<BakeryDetailDto> findAllFavorites(Long userId, Double userLat, Double userLng, Pageable pageable) {
		// 좋아요 누른 가게 아이디 조회
		List<Favorite> favorites = favoriteRepository.findByUser_UserId(userId);
		List<Long> bakeryIds = favorites.stream()
			.map(f -> f.getBakery().getBakeryId())
			.toList();

		if(bakeryIds.isEmpty()) return Page.empty();

		Page<Bakery> bakeries = bakeryRepository.findByBakeryIdInAndDeletedAtIsNull(bakeryIds, pageable);

		List<BakeryDetailDto> bakeryDetailDtos = bakeries.getContent().stream()
			.map(b -> {
				double distance = (userLat == null || userLng == null) ? 0.0
					: bakeryService.calculateDistance(userLat, userLng, b.getLatitude(), b.getLongitude());
				return BakeryDetailDto.from(b, distance);
			})
			.toList();

		return new PageImpl<>(bakeryDetailDtos, pageable, bakeries.getTotalElements());
	}

	@Transactional(readOnly = true)
	public List<BakeryDetailDto> getTop10BestBakeries(Double userLat, Double userLng) {
		if (userLat == null || userLng == null) {
			return bakeryRepository.findTop10ByFavorites().stream()
				.map(bakery -> BakeryDetailDto.from(bakery, 0.0)) // ✅ 로그인X or 주소 미등록 → 거리 0.0km 처리
				.toList();
		}

		return bakeryRepository.findBestBakeriesByLocation(userLat, userLng).stream()
			.map(bakery -> {
				double distance = bakeryService.calculateDistance(userLat, userLng, bakery.getLatitude(), bakery.getLongitude());
				return BakeryDetailDto.from(bakery, distance);
			})
			.toList();
	}
}
