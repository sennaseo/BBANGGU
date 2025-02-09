package com.ssafy.bbanggu.favorite;

import java.util.List;

import com.ssafy.bbanggu.bakery.dto.BakeryDetailDto;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/favorite")
@RequiredArgsConstructor
public class FavoriteController {

	private final FavoriteService favoriteService;
	private final UserRepository userRepository;

	// 관심 가게 등록
	@PostMapping("/{bakery_id}")
	public ResponseEntity<ApiResponse> addFavorite(Authentication authentication, @PathVariable Long bakery_id) {
		favoriteService.addFavorite(Long.parseLong(authentication.getName()), bakery_id);
		return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("관심가게 등록이 완료되었습니다.", null));
	}

	// 관심 가게 취소
	@DeleteMapping("/{bakery_id}")
	public ResponseEntity<ApiResponse> removeFavorite(Authentication authentication, @PathVariable Long bakery_id) {
		try {
			favoriteService.removeFavorite(Long.parseLong(authentication.getName()), bakery_id);
			return ResponseEntity.ok().body(new ApiResponse("관심 가게 취소가 완료되었습니다.", null));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("관심 가게 취소가 실패하였습니다.", null));  // 400 상태 코드
		}
	}

	// 유저가 좋아요한 가게 조회
	@GetMapping
	public ResponseEntity<ApiResponse> getFavoriteBakeries(
		Authentication authentication,
		@PageableDefault(size = 10) Pageable pageable,
		@RequestParam(required = false) Double lat,
		@RequestParam(required = false) Double lng
	) {
		// 📌 사용자 위치 default: 서울 성수동
		if (lat == null || lng == null) {
			lat = 37.5446;
			lng = 127.0553;
		}

		try {
			Long userId = Long.parseLong(authentication.getName());
			Page<BakeryDetailDto> bakeries = favoriteService.findAllFavorites(userId, lat, lng, pageable);

			return ResponseEntity.ok().body(new ApiResponse("사용자가 관심가게로 등록한 모든 가게를 조회하였습니다.", bakeries));
		} catch (NumberFormatException e) {
			throw new CustomException(ErrorCode.TOKEN_VERIFICATION_FAILED);
		} catch (IllegalArgumentException e) {
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}
	}

	// BEST 가게 조회
	@GetMapping("/best")
	public ResponseEntity<ApiResponse> getBestBakeries(Authentication authentication) {
		List<BakeryDetailDto> bestBakeries;

		// 아직 회원가입을 하지 않은 사용자인 경우
		if (authentication == null) {
			bestBakeries = favoriteService.getTop10ByFavorites();
			return ResponseEntity.ok().body(new ApiResponse("BEST 가게 조회에 성공하였습니다.", bestBakeries));
		}

		Long userId = Long.parseLong(authentication.getName());
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// 아직 주소를 등록하지 않은 회원
		if (user.getLatitude() == 0 || user.getLongitude() == 0) {
			bestBakeries = favoriteService.getTop10ByFavorites();
		} else { // 주소를 등록한 회원
			bestBakeries = favoriteService.getTop10ByFavoritesWithLocation(user.getLatitude(), user.getLongitude());
		}

		return ResponseEntity.ok().body(new ApiResponse("BEST 가게 조회에 성공하였습니다.", bestBakeries));
	}
}
