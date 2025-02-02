package com.ssafy.bbanggu.favorite;

import com.ssafy.bbanggu.bakery.Bakery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

	private final FavoriteRepository favoriteRepository;

	// 좋아요 추가
	@Transactional
	public String addFavorite(Long userId, Long bakeryId) {
		// 이미 좋아요한 상태인지 확인
		if (favoriteRepository.existsByUserIdAndBakeryId(userId, bakeryId)) {
			throw new IllegalArgumentException("이미 좋아요한 가게입니다.");
		}

		// 새로 좋아요 추가
		Favorite favorite = Favorite.builder()
			.userId(userId)  // userId만 설정
			.bakeryId(bakeryId)  // bakeryId만 설정
			.isLiked(true)
			.build();


		favoriteRepository.save(favorite);
		return "좋아요가 등록되었습니다.";
	}

	// 좋아요 취소
	@Transactional
	public String removeFavorite(Long userId, Long bakeryId) {
		Favorite favorite = favoriteRepository.findByUserIdAndBakeryId(userId, bakeryId)
			.orElseThrow(() -> new IllegalArgumentException("좋아요 하지 않은 가게입니다."));

		favoriteRepository.delete(favorite);
		return "좋아요가 취소되었습니다.";
	}

	// 유저가 좋아요한 모든 가게 조회
	@Transactional(readOnly = true)
	public List<Bakery> findAllFavorites(Long userId) {
		return favoriteRepository.findByUserId(userId).stream()
			.map(Favorite::getBakery)
			.collect(Collectors.toList());
	}
}
