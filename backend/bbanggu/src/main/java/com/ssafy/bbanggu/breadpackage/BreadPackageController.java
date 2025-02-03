package com.ssafy.bbanggu.breadpackage;

import com.ssafy.bbanggu.breadpackage.dto.BreadPackageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/bread-package")
@RequiredArgsConstructor
public class BreadPackageController {

	private final BreadPackageService breadPackageService;

	@PostMapping
	public ResponseEntity<?> createPackage(@RequestBody BreadPackageDto request) {
		try {
			BreadPackageDto createdPackage = breadPackageService.createPackage(request);
			return ResponseEntity.status(HttpStatus.CREATED).body(createdPackage);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating the package.");
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deletePackage(@PathVariable Long id) {
		try {
			boolean deleted = breadPackageService.deletePackage(id);
			if (deleted) {
				return ResponseEntity.ok("Package deleted successfully.");
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Package not found.");
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the package.");
		}
	}

	// 가게 ID로 모든 빵 패키지 조회 API
	@GetMapping("/bakery/{bakeryId}")
	public ResponseEntity<?> getPackagesByBakeryId(@PathVariable Long bakeryId) {
		try {
			List<BreadPackageDto> packages = breadPackageService.getPackagesByBakeryId(bakeryId);
			if (packages.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("빵꾸러미가 없습니다.");
			}
			return ResponseEntity.ok(packages);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 날짜로 빵 패키지 조회 API
	@GetMapping("/bakery/{bakeryId}/date")
	public ResponseEntity<?> getPackagesByDate(
		@PathVariable Long bakeryId,
		@RequestParam("startDate") String startDate,
		@RequestParam("endDate") String endDate) {
		try {
			// 날짜만 오는 경우 처리 (시간은 00:00:00으로 설정)
			if (startDate.length() == 10) {
				startDate = startDate + "T00:00:00";
			}
			if (endDate.length() == 10) {
				// endDate 날짜 +1 처리하여 23:59:59로 설정
				LocalDateTime endDateTime = LocalDateTime.parse(endDate + "T00:00:00");
				endDateTime = endDateTime.plusDays(1).minusSeconds(1); // 하루를 더하고 1초 뺀 값 (23:59:59)
				endDate = endDateTime.toString(); // 문자열로 변환하여 endDate에 다시 할당
			}

			LocalDateTime start = LocalDateTime.parse(startDate);
			LocalDateTime end = LocalDateTime.parse(endDate);
			// 베이커리와 기간을 기준으로 빵 패키지 조회
			List<BreadPackageDto> packages = breadPackageService.getPackagesByBakeryAndDate(bakeryId, start, end);

			if (packages.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("빵꾸러미가 없습니다.");
			}
			return ResponseEntity.ok(packages);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}
}
