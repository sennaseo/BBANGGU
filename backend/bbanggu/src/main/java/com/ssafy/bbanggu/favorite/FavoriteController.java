package com.ssafy.bbanggu.favorite;

import com.ssafy.bbanggu.bakery.Bakery;
import com.ssafy.bbanggu.bakery.dto.BakeryDto;
import com.ssafy.bbanggu.bakery.BakeryService;
import com.ssafy.bbanggu.favorite.dto.FavoriteDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/favorite")
@RequiredArgsConstructor
public class FavoriteController {


	private final FavoriteService favoriteService;

	// 관심 가게 등록
	@PostMapping
	public ResponseEntity<String> addFavorite(@RequestBody FavoriteDto favoriteDto) {
		try {
			String response = favoriteService.addFavorite(favoriteDto.userId(), favoriteDto.bakeryId());
			return ResponseEntity.status(201).body(response);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(e.getMessage());  // 400 상태 코드
		}
	}

	// 관심 가게 취소
	@PostMapping("/remove")
	public ResponseEntity<String> removeFavorite(@RequestBody FavoriteDto favoriteDto) {
		try {
			String response = favoriteService.removeFavorite(favoriteDto.userId(), favoriteDto.bakeryId());
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(e.getMessage());  // 400 상태 코드
		}
	}

	// 유저가 좋아요한 가게 조회
	@GetMapping
	public ResponseEntity<List<BakeryDto>> getFavoriteBakeries(@RequestParam Long userId) {
		try {
			List<Bakery> bakeries = favoriteService.findAllFavorites(userId);
			List<BakeryDto> bakeryDtos = bakeries.stream()
				.map(BakeryDto::from)
				.collect(Collectors.toList());
			return ResponseEntity.ok(bakeryDtos);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(null);  // 예외 발생 시 400 상태 코드
		}
	}
}
