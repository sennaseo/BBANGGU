package com.ssafy.bbanggu.bakery;

import com.ssafy.bbanggu.bakery.dto.BakeryDetailDto;
import com.ssafy.bbanggu.bakery.dto.BakeryDto;
import com.ssafy.bbanggu.bakery.dto.BakeryLocationDto;
import com.ssafy.bbanggu.bakery.service.BakeryService;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.user.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/bakery")
@RequiredArgsConstructor
public class BakeryController {

	private final BakeryService bakeryService;
	private final UserRepository userRepository;
	private final BakeryRepository bakeryRepository;

	// 모든 가게 조회
	@GetMapping
	public ResponseEntity<ApiResponse> getAllBakeries(
		@RequestParam(defaultValue = "createdAt") String sortBy,
		@RequestParam(defaultValue = "desc") String sortOrder,
		@PageableDefault(size = 10) Pageable pageable,
		@RequestParam(required = false) Double lat,
		@RequestParam(required = false) Double lng
	) {
		// 📌 사용자 위치 default: 서울 성수동
		if (lat == null || lng == null) {
			lat = 37.5446;
			lng = 127.0553;
		}

		List<BakeryDetailDto> bakeries = bakeryService.getAllBakeries(sortBy, sortOrder, pageable, lat, lng);
		return ResponseEntity.ok().body(new ApiResponse("모든 가게 조회에 성공하였습니다.", bakeries));
	}

	// 가게 추가
	@PostMapping
	public ResponseEntity<ApiResponse> createBakery(@RequestBody @Valid BakeryDto bakery) {
		BakeryDto createdBakery = bakeryService.createBakery(bakery);
		return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("가게 등록이 완료되었습니다.", createdBakery));
	}

	// 가게 상세 조회
	@GetMapping("/{bakery_id}")
	public ResponseEntity<ApiResponse> getBakeryById(
		@PathVariable Long bakery_id,
		@RequestParam(required = false) Double lat,
		@RequestParam(required = false) Double lng
	) {
		// 📌 사용자 위치 default: 서울 성수동
		if (lat == null || lng == null) {
			lat = 37.5446;
			lng = 127.0553;
		}

		BakeryDetailDto bakery = bakeryService.findById(bakery_id, lat, lng);
		return ResponseEntity.ok().body(new ApiResponse("가게 정보 조회에 성공하였습니다.", bakery));
	}

	// 가게 수정
	@PutMapping("/{bakery_id}")
	public ResponseEntity<ApiResponse> updateBakery(Authentication authentication, @PathVariable Long bakery_id, @RequestBody BakeryDto updates) {
		// ✅ Access Token이 없는 경우 예외처리
		if (authentication == null || authentication.getName() == null) {
			throw new CustomException(ErrorCode.INVALID_ACCESS_TOKEN);
		}

		// ✅ userId 가져오기
		Long userId = Long.parseLong(authentication.getName());
		if (!userRepository.existsById(userId)) {
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}

		Bakery bakery = bakeryRepository.findByBakeryIdAndDeletedAtIsNull(bakery_id); // 삭제되지 않은 것만
		if (bakery == null) {
			throw new CustomException(ErrorCode.BAKERY_NOT_FOUND);
		}

		// ✅ 현재 로그인한 사용자가 이 가게의 주인인지 검증
		if (!bakery.getUser().getUserId().equals(userId)) {
			throw new CustomException(ErrorCode.NO_PERMISSION_TO_EDIT_BAKERY);
		}

		BakeryDto updatedBakery = bakeryService.update(bakery, updates);
		return ResponseEntity.ok().body(new ApiResponse("가게 정보가 성공적으로 수정되었습니다.", updatedBakery));
	}

	// 가게 삭제
	@DeleteMapping("/{bakery_id}")
	public ResponseEntity<ApiResponse> deleteBakery(Authentication authentication, @PathVariable Long bakery_id) {
		// ✅ Access Token이 없는 경우 예외처리
		if (authentication == null || authentication.getName() == null) {
			throw new CustomException(ErrorCode.INVALID_ACCESS_TOKEN);
		}

		// ✅ userId 가져오기
		Long userId = Long.parseLong(authentication.getName());
		if (!userRepository.existsById(userId)) {
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}

		Bakery bakery = bakeryRepository.findByBakeryIdAndDeletedAtIsNull(bakery_id);
		if (bakery == null) {
			throw new CustomException(ErrorCode.BAKERY_NOT_FOUND);
		}

		if (!bakery.getUser().getUserId().equals(userId)) {
			throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
		}

		bakeryService.delete(bakery);
		return ResponseEntity.ok().body(new ApiResponse("가게 삭제가 성공적으로 완료되었습니다.", null));
	}

	// 키워드로 가게 검색
	@GetMapping("/search")
	public ResponseEntity<ApiResponse> searchBakeries(
		@RequestParam(required = false) String keyword,
		@PageableDefault(size = 10) Pageable pageable,
		@RequestParam(required = false) Double lat,
		@RequestParam(required = false) Double lng
	) {
		// 📌 사용자 위치 default: 서울 성수동
		if (lat == null || lng == null) {
			lat = 37.5446;
			lng = 127.0553;
		}

		Page<BakeryDetailDto> bakeries = bakeryService.searchByKeyword(keyword, pageable, lat, lng);
		return ResponseEntity.ok().body(new ApiResponse("검색 결과 조회에 성공하였습니다.", bakeries));
	}

	// 모든 가게의 좌표 조회
	@GetMapping("/locations")
	public ResponseEntity<List<BakeryLocationDto>> getAllBakeryLocations() {
		List<BakeryLocationDto> bakeryLocations = bakeryService.findAllBakeryLocations();
		return ResponseEntity.ok(bakeryLocations);
	}
}
