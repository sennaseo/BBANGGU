package com.ssafy.bbanggu.favorite;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.bakery.dto.BakeryDetailDto;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/favorite")
@RequiredArgsConstructor
public class FavoriteController {

	private final FavoriteService favoriteService;
	private final UserRepository userRepository;

	// 관심 가게 등록
	@PostMapping("/{bakery_id}")
	public ResponseEntity<ApiResponse> addFavorite(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@PathVariable Long bakery_id
	) {
		favoriteService.addFavorite(userDetails.getUserId(), bakery_id);
		return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("관심가게 등록이 완료되었습니다.", null));
	}

	// 관심 가게 취소
	@DeleteMapping("/{bakery_id}")
	public ResponseEntity<ApiResponse> removeFavorite(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@PathVariable Long bakery_id
	) {
		favoriteService.removeFavorite(userDetails.getUserId(), bakery_id);
		return ResponseEntity.ok().body(new ApiResponse("관심 가게 취소가 완료되었습니다.", null));
	}

	// 유저가 좋아요한 가게 조회
	@GetMapping
	public ResponseEntity<ApiResponse> getFavoriteBakeries(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@PageableDefault(size = 10) Pageable pageable
	) {
		Double lat = null;
		Double lng = null;

		if (userDetails.getLatitude() != 0.0 && userDetails.getLongitude() != 0.0) {
			lat = userDetails.getLatitude();
			lng = userDetails.getLongitude();
		}

		Long userId = userDetails.getUserId();
		Page<BakeryDetailDto> bakeries = favoriteService.findAllFavorites(userId, lat, lng, pageable);

		return ResponseEntity.ok().body(new ApiResponse("사용자가 관심가게로 등록한 모든 가게를 조회하였습니다.", bakeries));
	}

	// BEST 가게 조회
	@GetMapping("/best")
	public ResponseEntity<ApiResponse> getBestBakeries(
		@AuthenticationPrincipal CustomUserDetails userDetails
	) {
		List<BakeryDetailDto> bestBakeries;

		if (userDetails == null || userDetails.getLatitude() == 0.0 || userDetails.getLongitude() == 0.0) {
			bestBakeries = favoriteService.getTop10BestBakeries(null, null);
		} else {
			// ✅ 로그인 & 주소 등록한 사용자 → 거리 기반 추천
			bestBakeries = favoriteService.getTop10BestBakeries(userDetails.getLatitude(), userDetails.getLongitude());
		}

		return ResponseEntity.ok().body(new ApiResponse("BEST 가게 조회에 성공하였습니다.", bestBakeries));
	}

	@GetMapping("/bakery/{bakeryId}")
	public ResponseEntity<ApiResponse> getfavoritesByBakeryId(@AuthenticationPrincipal CustomUserDetails userDetails,
		@PathVariable long bakeryId) {

		Integer count = favoriteService.getBakeryFavorCount(bakeryId);
		return ResponseEntity.ok().body(new ApiResponse("가게 좋아요 개수 조회 성공", count));
	}
}
