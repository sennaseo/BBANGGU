package com.ssafy.bbanggu.bakery;

import com.ssafy.bbanggu.bakery.dto.BakeryDetailDto;
import com.ssafy.bbanggu.bakery.dto.BakeryDto;
import com.ssafy.bbanggu.bakery.dto.BakeryLocationDto;
import com.ssafy.bbanggu.bakery.service.BakeryService;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.common.response.ApiResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/bakery")
@RequiredArgsConstructor
public class BakeryController {
	private final BakeryService bakeryService;

	// 모든 가게 조회
	@GetMapping
	public ResponseEntity<ApiResponse> getAllBakeries(
		@RequestParam(defaultValue = "createdAt") String sortBy,
		@RequestParam(defaultValue = "desc") String sortOrder,
		@PageableDefault(size = 10) Pageable pageable
	) {
		Page<BakeryDetailDto> bakeries = bakeryService.getAllBakeries(sortBy, sortOrder, pageable);
		return ResponseEntity.ok().body(new ApiResponse("모든 가게 조회에 성공하였습니다.", bakeries));
	}

	// 가게 추가
	@PostMapping
	public ResponseEntity<ApiResponse> createBakery(@RequestBody @Valid BakeryDto bakery) {
		BakeryDto createdBakery = bakeryService.createBakery(bakery);
		return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("가게 등록이 완료되었습니다.", createdBakery));
	}

	// 가게 상세 조회
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse> getBakeryById(@PathVariable Long id) {
		BakeryDetailDto bakery = bakeryService.findById(id);
		return ResponseEntity.ok().body(new ApiResponse("가게 정보 조회에 성공하였습니다.", bakery));
	}

	// 가게 수정
	@PutMapping("/{bakery_id}")
	public ResponseEntity<ApiResponse> updateBakery(Authentication authentication, @PathVariable Long bakery_id, @RequestBody BakeryDto updates) {
		// ✅ Access Token이 없는 경우 예외처리
		if (authentication == null || authentication.getName() == null) {
			throw new CustomException(ErrorCode.INVALID_ACCESS_TOKEN);
		}

		// ✅ 현재 로그인한 사용자 이메일 가져오기
		String userEmail = authentication.getName();

		BakeryDto updatedBakery = bakeryService.update(userEmail, bakery_id, updates);
		return ResponseEntity.ok().body(new ApiResponse("가게 정보가 성공적으로 수정되었습니다.", updatedBakery));
	}

	// 가게 삭제
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteBakery(@PathVariable Long id) {
		bakeryService.delete(id);
		return ResponseEntity.noContent().build();
	}

	// 키워드로 가게 검색
	@GetMapping("/search")
	public ResponseEntity<ApiResponse> searchBakeries(
		@RequestParam String keyword,
		@PageableDefault(size = 10) Pageable pageable
	) {
		Page<BakeryDto> bakeries = bakeryService.searchByKeyword(keyword, pageable);
		return ResponseEntity.ok().body(new ApiResponse("검색 결과 조회에 성공하였습니다.", bakeries));
	}

	// 모든 가게의 좌표 조회
	@GetMapping("/locations")
	public ResponseEntity<List<BakeryLocationDto>> getAllBakeryLocations() {
		List<BakeryLocationDto> bakeryLocations = bakeryService.findAllBakeryLocations();
		return ResponseEntity.ok(bakeryLocations);
	}
}
