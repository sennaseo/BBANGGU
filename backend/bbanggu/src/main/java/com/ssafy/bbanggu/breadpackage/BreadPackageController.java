package com.ssafy.bbanggu.breadpackage;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.breadpackage.dto.BreadPackageDto;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.common.response.ErrorResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/bread-package")
@RequiredArgsConstructor
public class BreadPackageController {

	private final BreadPackageService breadPackageService;

	/**
	 * 빵꾸러미 생성 API
	 */
	@PostMapping
	public ResponseEntity<?> createPackage(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@RequestBody BreadPackageDto request
	) {
		log.info("✨ 빵꾸러미 생성 시작 ✨");
		try {
			BreadPackageDto createdPackage = breadPackageService.createPackage(userDetails, request);
			return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("빵꾸러미 등록 성공", createdPackage));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}


	@DeleteMapping("/{package_id}")
	public ResponseEntity<?> deletePackage(@PathVariable Long package_id) {
		boolean deleted = breadPackageService.deletePackage(package_id);
		if (deleted) {
			return ResponseEntity.ok("Package deleted successfully.");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Package not found.");
		}
	}


	/**
	 * 가게별 빵꾸러미 조회 API
	 */
	@GetMapping("/bakery/{bakeryId}")
	public ResponseEntity<ApiResponse> getPackagesByBakeryId(@PathVariable Long bakeryId) {
		log.info("✨ 가게별 빵꾸러미 조회 시작 ✨");
		List<BreadPackageDto> packages = breadPackageService.getPackagesByBakeryId(bakeryId);
		if(!packages.isEmpty()) {
			return ResponseEntity.ok().body(new ApiResponse(bakeryId + "번 가게의 빵꾸러미를 모두 조회하였습니다.", packages));
		}
		else {
			return ResponseEntity.ok().body(new ApiResponse(bakeryId + "번 가게에는 빵꾸러미가 존재하지 않습니다.", packages));
		}
	}


	/**
	 * 기간 내 빵꾸러미 조회 API
	 */
	@GetMapping("/bakery/{bakeryId}/date")
	public ResponseEntity<?> getPackagesByDate(
		@PathVariable Long bakeryId,
		@RequestParam("startDate") String startDate,
		@RequestParam("endDate") String endDate) {
		log.info("✨ 기간별 빵꾸러미 조회 시작 ✨");
		try {
			// ✅ TIMESTAMP 형식 변환을 위한 Formatter
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

			// ✅ 날짜만 받을 경우, LocalDate로 변환 후 LocalDateTime으로 변경
			LocalDate startLocalDate = LocalDate.parse(startDate);
			LocalDateTime start = startLocalDate.atStartOfDay(); // 00:00:00

			LocalDate endLocalDate = LocalDate.parse(endDate);
			LocalDateTime end = endLocalDate.atTime(23, 59, 59); // 23:59:59
			log.info("✅ 기간 범위 설정 완료: " + startLocalDate + " ~ " + endLocalDate);

			// ✅ 베이커리 & 기간 기준으로 빵 패키지 조회
			List<BreadPackageDto> packages = breadPackageService.getPackagesByBakeryAndDate(bakeryId, start, end);
			if (packages.isEmpty()) {
				throw new CustomException(ErrorCode.BREAD_PACKAGE_NOT_FOUND);
			}

			return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("빵꾸러미 조회에 성공하였습니다.", packages));
		} catch (DateTimeParseException e) {
			throw new CustomException(ErrorCode.WRONG_DATE_FORMAT);
		}
	}

	@GetMapping("/sell/package/{packageId}/quantity/{quantity}")
	public ResponseEntity<?> sellBreadPackages(@PathVariable long packageId, @PathVariable int quantity) {
		try {
			int remains = breadPackageService.updateBreadPackage(packageId, quantity * -1);    // 판매라서 -1 곱해줌
			return ResponseEntity.status(HttpStatus.OK)
				.body(new ApiResponse("빵꾸러미 판매처리 성공(남은 재고:" + remains + "개)", null));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("빵꾸러미 판매처리 실패");
		}
	}
	@GetMapping("/add/package/{packageId}/quantity/{quantity}")
	public ResponseEntity<?> cancelBreadPackages(@PathVariable long packageId, @PathVariable int quantity) {
		try {
			int remains = breadPackageService.updateBreadPackage(packageId, quantity);
			return ResponseEntity.status(HttpStatus.OK)
				.body(new ApiResponse("빵꾸러미 추가처리 성공(남은 재고:" + remains + "개)", null));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("빵꾸러미 추가처리 실패");
		}
	}
}
