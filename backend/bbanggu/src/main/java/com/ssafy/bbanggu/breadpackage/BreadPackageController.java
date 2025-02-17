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
import org.springframework.security.core.parameters.P;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.breadpackage.dto.BreadPackageDto;
import com.ssafy.bbanggu.breadpackage.dto.TodayBreadPackageDto;
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
		@Valid @RequestBody BreadPackageDto request
	) {
		log.info("✨ 빵꾸러미 생성 ✨");
		BreadPackageDto createdPackage = breadPackageService.createPackage(userDetails, request);
		return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("빵꾸러미 등록 성공", createdPackage));
	}


	/**
	 * 빵꾸러미 삭제 API
	 */
	@DeleteMapping("/{package_id}")
	public ResponseEntity<ApiResponse> deletePackage(@PathVariable Long package_id) {
		log.info("✨ 빵꾸러미 삭제 ✨");
		breadPackageService.deletePackage(package_id);
		return ResponseEntity.ok().body(new ApiResponse("빵꾸러미 삭제가 성공적으로 완료되었습니다.", null));
	}


	/**
	 * 가게별 빵꾸러미 현황 조회 API
	 *
	 * @param userDetails 현재 로그인한 사용자 정보
	 * @param bakery_id 가게 ID
	 * @return 해당 가게의 오늘 빵꾸러미 정보
	 */
	@GetMapping("/{bakery_id}/today")
	public ResponseEntity<ApiResponse> getTodayPackagesByBakeryId(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@PathVariable Long bakery_id
	){
		log.info("✨ {}번 빵집 빵꾸러미 현황 ✨", bakery_id);
		TodayBreadPackageDto response = breadPackageService.getTodayPackagesByBakeryId(userDetails, bakery_id);
		return ResponseEntity.ok(new ApiResponse("오늘의 빵꾸러미 조회가 완료되었습니다.", response));
	}


	/**
	 * 가게의 전체 빵꾸러미 조회 API
	 */
	@GetMapping("/bakery/{bakeryId}")
	public ResponseEntity<ApiResponse> getPackagesByBakeryId(@PathVariable Long bakeryId) {
		log.info("✨ {}번 가게의 빵꾸러미 조회 ✨", bakeryId);
		List<BreadPackageDto> packages = breadPackageService.getPackagesByBakeryId(bakeryId);
		if(!packages.isEmpty()) {
			return ResponseEntity.ok().body(new ApiResponse(bakeryId + "번 가게의 빵꾸러미를 모두 조회하였습니다.", packages));
		}
		else {
			return ResponseEntity.ok().body(new ApiResponse(bakeryId + "번 가게에는 빵꾸러미가 존재하지 않습니다.", packages));
		}
	}


	/**
	 * 가게의 기간 내 빵꾸러미 전체 조회 API
	 */
	@GetMapping("/bakery/{bakeryId}/date")
	public ResponseEntity<?> getPackagesByDate(
		@PathVariable Long bakeryId,
		@RequestParam("startDate") String startDate,
		@RequestParam("endDate") String endDate) {
		log.info("✨ 기간별 빵꾸러미 조회 ✨");
		try {
			// ✅ 날짜만 받을 경우, LocalDate로 변환 후 LocalDateTime으로 변경
			LocalDate startLocalDate = LocalDate.parse(startDate);
			LocalDateTime start = startLocalDate.atStartOfDay(); // 00:00:00

			LocalDate endLocalDate = LocalDate.parse(endDate);
			LocalDateTime end = endLocalDate.atTime(23, 59, 59); // 23:59:59
			log.info("✅ 기간 범위 설정 완료: " + startLocalDate + " ~ " + endLocalDate);

			// ✅ 베이커리 & 기간 기준으로 빵 패키지 조회
			List<BreadPackageDto> packages = breadPackageService.getPackagesByBakeryAndDate(bakeryId, start, end);

			return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("빵꾸러미 조회에 성공하였습니다.", packages));
		} catch (DateTimeParseException e) {
			throw new CustomException(ErrorCode.WRONG_DATE_FORMAT);
		}
	}


	/**
	 * 빵꾸러미 수정 API
	 */
	@PutMapping("/{package_id}")
	public ResponseEntity<ApiResponse> updatePackage(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@PathVariable Long package_id,
		@Valid @RequestBody BreadPackageDto request
	){
		log.info("✨ 빵꾸러미 수정 ✨");
		BreadPackageDto updatedPackage = breadPackageService.updateBreadPackage(userDetails, package_id, request);
		return ResponseEntity.ok().body(new ApiResponse("빵꾸러미 수정이 성공적으로 완료되었습니다.", updatedPackage));
	}


	/**
	 * 오늘 빵꾸러미를 등록한 가게의 빵꾸러미를 다음날 수동 삭제하는 API
	 */
	@PostMapping("/process-missed")
	public ResponseEntity<String> processMissedReservations() {
		breadPackageService.scheduleExpiredPackagesProcessing();
		return ResponseEntity.ok("✅ 오늘의 빵꾸러미가 자동 삭제 처리되었습니다.");
	}
}
