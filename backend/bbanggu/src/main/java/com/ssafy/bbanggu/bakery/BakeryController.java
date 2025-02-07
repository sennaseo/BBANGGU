package com.ssafy.bbanggu.bakery;

import com.ssafy.bbanggu.bakery.dto.BakeryDto;
import com.ssafy.bbanggu.bakery.dto.BakeryLocationDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bakery")
public class BakeryController {

	private final BakeryService bakeryService;

	public BakeryController(BakeryService bakeryService) {
		this.bakeryService = bakeryService;
	}

	// 모든 가게 조회
	@GetMapping
	public ResponseEntity<List<BakeryDto>> getAllBakeries() {
		List<BakeryDto> bakeries = bakeryService.findAll();
		return ResponseEntity.ok(bakeries);
	}

	// 가게 추가
	@PostMapping
	public ResponseEntity<BakeryDto> createBakery(@RequestBody Bakery bakery) {
		BakeryDto createdBakery = bakeryService.save(bakery);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdBakery);
	}

	// 가게 상세 조회
	@GetMapping("/{id}")
	public ResponseEntity<BakeryDto> getBakeryById(@PathVariable Long id) {
		BakeryDto bakery = bakeryService.findById(id);
		return ResponseEntity.ok(bakery);
	}

	// 가게 수정
	@PutMapping("/{id}")
	public ResponseEntity<BakeryDto> updateBakery(@PathVariable Long id, @RequestBody Bakery bakery) {
		BakeryDto updatedBakery = bakeryService.update(id, bakery);
		return ResponseEntity.ok(updatedBakery);
	}

	// 가게 삭제
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteBakery(@PathVariable Long id) {
		bakeryService.delete(id);
		return ResponseEntity.noContent().build();
	}

	// 키워드로 가게 검색
	@GetMapping("/search")
	public ResponseEntity<List<BakeryDto>> searchBakeries(@RequestParam String keyword) {
		List<BakeryDto> bakeries = bakeryService.searchByKeyword(keyword);
		return ResponseEntity.ok(bakeries);
	}

	// 모든 가게의 좌표 조회
	@GetMapping("/locations")
	public ResponseEntity<List<BakeryLocationDto>> getAllBakeryLocations() {
		List<BakeryLocationDto> bakeryLocations = bakeryService.findAllBakeryLocations();
		return ResponseEntity.ok(bakeryLocations);
	}
}
