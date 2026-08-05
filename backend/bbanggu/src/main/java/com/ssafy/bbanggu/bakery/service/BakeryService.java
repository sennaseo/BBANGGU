package com.ssafy.bbanggu.bakery.service;

import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.bakery.domain.Bakery;
import com.ssafy.bbanggu.bakery.domain.BakeryPickupTimetable;
import com.ssafy.bbanggu.bakery.domain.Settlement;
import com.ssafy.bbanggu.bakery.dto.BakeryCreateDto;
import com.ssafy.bbanggu.bakery.dto.BakeryLocationDto;
import com.ssafy.bbanggu.bakery.dto.BakerySettlementDto;
import com.ssafy.bbanggu.bakery.dto.PickupTimeDto;
import com.ssafy.bbanggu.bakery.dto.SettlementUpdate;
import com.ssafy.bbanggu.bakery.repository.BakeryPickupTimetableRepository;
import com.ssafy.bbanggu.bakery.repository.BakeryRepository;
import com.ssafy.bbanggu.bakery.dto.BakeryDetailDto;
import com.ssafy.bbanggu.bakery.dto.BakeryDto;
import com.ssafy.bbanggu.bakery.repository.SettlementRepository;
import com.ssafy.bbanggu.breadpackage.BreadPackage;
import com.ssafy.bbanggu.breadpackage.BreadPackageRepository;
import com.ssafy.bbanggu.breadpackage.BreadPackageService;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.favorite.FavoriteRepository;
import com.ssafy.bbanggu.user.Role;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;
import com.ssafy.bbanggu.util.image.ImageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BakeryService {

	private final BakeryRepository bakeryRepository;
	private final GeoService geoService;
	private final UserRepository userRepository;
	private final SettlementRepository settlementRepository;
	private final FavoriteRepository favoriteRepository;
	private final BakeryPickupService bakeryPickupService;
	private final ImageService imageService;
	private final BreadPackageRepository breadPackageRepository;
	private final BakeryPickupTimetableRepository bakeryPickupTimetableRepository;

	// 삭제되지 않은 모든 가게 조회
	@Transactional(readOnly = true)
	public List<BakeryDetailDto> getAllBakeries(CustomUserDetails userDetails, String sortBy, String sortOrder, Pageable pageable) {
		// 사용자 위치 정보 추출
		final Double userLat = Optional.ofNullable(userDetails)
			.filter(u -> u.getLatitude() != 0.0)
			.map(CustomUserDetails::getLatitude)
			.orElse(null);

		final Double userLng = Optional.ofNullable(userDetails)
			.filter(u -> u.getLongitude() != 0.0)
			.map(CustomUserDetails::getLongitude)
			.orElse(null);

		Sort.Direction direction = sortOrder.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;

		LocalDate today = LocalDate.now();
		LocalDateTime startOfToday = today.atStartOfDay();
		LocalDateTime endOfToday = today.plusDays(1).atStartOfDay();

		// ✅ 1. JPA에서 SQL 정렬 & 페이징 적용 (distance가 아닌 경우)
		if (!"distance".equals(sortBy)) {
			Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(direction, sortBy));
			if(userDetails == null) {
				return bakeryRepository.findAllByDeletedAtIsNull(sortedPageable)
					.stream()
					.map(bakery -> {
						PickupTimeDto pickupTime = bakeryPickupService.getPickupTimetable(bakery.getBakeryId());
						BreadPackage breadPackage = breadPackageRepository.findByBakeryIdAndToday(bakery.getBakeryId(), startOfToday, endOfToday);
						int price = 0;
						if (breadPackage != null) {
							price = breadPackage.getPrice();
						}
						return BakeryDetailDto.from(bakery, 0.0, false, pickupTime, price);
					})
					.collect(Collectors.toList());
			}
			return bakeryRepository.findAllByDeletedAtIsNull(sortedPageable)
				.stream()
				.map(bakery -> {
					double distance = (userLat == null || userLng == null) ? 0.0
						: calculateDistance(userLat, userLng, bakery.getLatitude(), bakery.getLongitude());

					boolean is_liked = favoriteRepository.existsByUser_UserIdAndBakery_BakeryId(userDetails.getUserId(), bakery.getBakeryId());
					PickupTimeDto pickupTime = bakeryPickupService.getPickupTimetable(bakery.getBakeryId());
					BreadPackage breadPackage = breadPackageRepository.findByBakeryIdAndToday(bakery.getBakeryId(), startOfToday, endOfToday);
					int price = 0;
					if (breadPackage != null) {
						price = breadPackage.getPrice();
					}
					return BakeryDetailDto.from(bakery, distance, is_liked, pickupTime, price);
				})
				.collect(Collectors.toList());
		}

		// ✅ 2. distance 정렬이 필요한 경우: JPA는 단순 조회, Java에서 정렬 후 페이징
		List<BakeryDetailDto> bakeries = bakeryRepository.findAllByDeletedAtIsNull(pageable)
			.stream()
			.map(bakery -> {
				double distance = (userLat == null || userLng == null) ? 0.0
					: calculateDistance(userLat, userLng, bakery.getLatitude(), bakery.getLongitude());
				boolean is_liked = favoriteRepository.existsByUser_UserIdAndBakery_BakeryId(userDetails.getUserId(), bakery.getBakeryId());
				PickupTimeDto pickupTime = bakeryPickupService.getPickupTimetable(bakery.getBakeryId());
				BreadPackage breadPackage = breadPackageRepository.findByBakeryIdAndToday(bakery.getBakeryId(), startOfToday, endOfToday);
				int price = 0;
				if (breadPackage != null) {
					price = breadPackage.getPrice();
				}
				return BakeryDetailDto.from(bakery, distance, is_liked, pickupTime, price);
			})
			.collect(Collectors.toList());

		// 🚀 Java에서 distance 기준으로 정렬
		if ("asc".equalsIgnoreCase(sortOrder)) {
			bakeries.sort(Comparator.comparing(BakeryDetailDto::distance));
		} else {
			bakeries.sort(Comparator.comparing(BakeryDetailDto::distance).reversed());
		}

		// 🚀 Java에서 수동 페이징 적용
		int start = (int) pageable.getOffset();
		int end = Math.min((start + pageable.getPageSize()), bakeries.size());
		return bakeries.subList(start, end);
	}


	// ID로 가게 조회
	@Transactional(readOnly = true)
	public BakeryDetailDto findById(CustomUserDetails userDetails, Long bakery_id) {
		// 사용자 위치 정보 추출
		final Double userLat = Optional.ofNullable(userDetails)
			.filter(u -> u.getLatitude() != 0.0)
			.map(CustomUserDetails::getLatitude)
			.orElse(null);

		final Double userLng = Optional.ofNullable(userDetails)
			.filter(u -> u.getLongitude() != 0.0)
			.map(CustomUserDetails::getLongitude)
			.orElse(null);

		Bakery bakery = bakeryRepository.findByBakeryIdAndDeletedAtIsNull(bakery_id); // 삭제되지 않은 것만
		if (bakery == null) {
			throw new CustomException(ErrorCode.BAKERY_NOT_FOUND);
		}

		LocalDate today = LocalDate.now();
		LocalDateTime startOfToday = today.atStartOfDay();
		LocalDateTime endOfToday = today.plusDays(1).atStartOfDay();

		PickupTimeDto pickupTime = bakeryPickupService.getPickupTimetable(bakery.getBakeryId());
		BreadPackage breadPackage = breadPackageRepository.findByBakeryIdAndToday(bakery.getBakeryId(), startOfToday, endOfToday);
		int price = 0;
		if (breadPackage != null) {
			price = breadPackage.getPrice();
		}

		if(userDetails == null) {
			return BakeryDetailDto.from(bakery, 0.0, false, pickupTime, price);
		}

		double distance = (userLat == null || userLng == null) ? 0.0
			: calculateDistance(userLat, userLng, bakery.getLatitude(), bakery.getLongitude());
		boolean is_liked = favoriteRepository.existsByUser_UserIdAndBakery_BakeryId(userDetails.getUserId(), bakery.getBakeryId());
		return BakeryDetailDto.from(bakery, distance, is_liked, pickupTime, price);
	}

	public double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
		final int R = 6371; // 지구 반지름 (단위: km)

		double dLat = Math.toRadians(lat2 - lat1);
		double dLng = Math.toRadians(lng2 - lng1);
		double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
				Math.sin(dLng / 2) * Math.sin(dLng / 2);
		double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return Math.round(R * c * 10) / 10.0; // 거리 반환 (km, 소수점 첫째 자리까지 반올림)
	}

	// 가게 추가
	@Transactional
	public BakeryCreateDto createBakery(Long userId, BakeryCreateDto bakeryDto, MultipartFile bakeryImage, MultipartFile bakeryBackgroundImage) {
		validateDuplicateBakery(bakeryDto.name(), bakeryDto.businessRegistrationNumber(), null);

		// 사용자 조회 (인증된 userId로 User 찾기 — body의 userId는 신뢰하지 않음)
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		String bakeryImageUrl = null;
		String bakeryBackgroundImgUrl = null;

		try {
			if (bakeryImage != null && !bakeryImage.isEmpty()) {
				bakeryImageUrl = imageService.saveImage(bakeryImage);
			}
			if (bakeryBackgroundImage != null && !bakeryBackgroundImage.isEmpty()) {
				bakeryBackgroundImgUrl = imageService.saveImage(bakeryBackgroundImage);
			}
		} catch (IOException e) {
			throw new CustomException(ErrorCode.BAKERY_IMAGE_UPLOAD_FAILED);
		}

		// 주소 기반 위경도 가져오기
		double[] latLng = getLatitudeLongitude(bakeryDto.addressRoad(), bakeryDto.addressDetail());
		double latitude = latLng[0];
		double longitude = latLng[1];

		// Dto -> Entity 변환
		Bakery bakery = Bakery.builder()
				.name(bakeryDto.name())
				.description(bakeryDto.description())
				.bakeryImageUrl(bakeryImageUrl)
				.bakeryBackgroundImgUrl(bakeryBackgroundImgUrl)
				.addressRoad(bakeryDto.addressRoad())
				.addressDetail(bakeryDto.addressDetail())
				.businessRegistrationNumber(bakeryDto.businessRegistrationNumber())
				.star(0.0)
				.latitude(latitude)
				.longitude(longitude)
				.user(user)
				.build();

		Bakery savedBakery = bakeryRepository.save(bakery);

		BakeryPickupTimetable timetable = BakeryPickupTimetable.builder().bakery(bakery).build();
		bakeryPickupTimetableRepository.save(timetable);
		return BakeryCreateDto.from(savedBakery);
	}

	// 가게의 위도, 경도 추출
	public double[] getLatitudeLongitude(String addressRoad, String addressDetail) {
		// 전체 주소 문자열 생성 (도로명주소 + 상세주소)
		String fullAddress = addressRoad + " " + addressDetail;

		// 주소 기반 위경도 가져오기
		double[] latLng = geoService.getLatLngFromAddress(fullAddress);
		return latLng;
	}

	/**
	 * 가게 정산 정보 등록
	 */
	@Transactional
	public BakerySettlementDto createSettlement(Long userId, BakerySettlementDto settlement, MultipartFile settlementImage) {
		User user = User.builder()
			.userId(userId)
			.build();

		String settlementImageFileUrl = null;
		try {
			if (settlementImage != null && !settlementImage.isEmpty()) {
				settlementImageFileUrl = imageService.saveImage(settlementImage);
			}
		} catch (IOException e) {
			throw new CustomException(ErrorCode.BAKERY_IMAGE_UPLOAD_FAILED);
		}

		Settlement bakerySet = Settlement.builder()
			.user(user)
			.bankName(settlement.bankName())
			.accountHolderName(settlement.accountHolderName())
			.accountNumber(settlement.accountNumber())
			.emailForTaxInvoice(settlement.emailForTaxInvoice())
			.businessLicenseFileUrl(settlementImageFileUrl)
			.build();

		Settlement savedSettlement = settlementRepository.save(bakerySet);
		return BakerySettlementDto.from(savedSettlement);
	}

	// 가게 수정
	@Transactional
	public BakeryDto update(
		CustomUserDetails userDetails, Long bakery_id, BakeryDto updates,
		MultipartFile bakeryImage, MultipartFile bakeryBackgroundImage
	){
		Bakery bakery = bakeryRepository.findByBakeryIdAndDeletedAtIsNull(bakery_id);
		if (bakery == null) {
			throw new CustomException(ErrorCode.BAKERY_NOT_FOUND);
		}

		// ✅ 현재 로그인한 사용자가 이 가게의 주인인지 검증
		Long userId = userDetails.getUserId();
		if (!bakery.getUser().getUserId().equals(userId)) {
			throw new CustomException(ErrorCode.NO_PERMISSION_TO_EDIT_BAKERY);
		}

		// ✅ 가게명 중복 검사
		if (updates != null && updates.name() != null
			&& bakeryRepository.existsByNameAndBakeryIdNot(updates.name(), bakery.getBakeryId())) {
			throw new CustomException(ErrorCode.BAKERY_NAME_ALREADY_IN_USE);
		}

		// ✅ 주소 변경 확인 후 위경도 업데이트
		String newAddrRoad = updates != null ? Optional.ofNullable(updates.addressRoad()).orElse(bakery.getAddressRoad()) : bakery.getAddressRoad();
		String newAddrDetail = updates != null ? Optional.ofNullable(updates.addressDetail()).orElse(bakery.getAddressDetail()) : bakery.getAddressDetail();

		if (!newAddrRoad.equals(bakery.getAddressRoad()) || !newAddrDetail.equals(bakery.getAddressDetail())) {
			double[] latLng = getLatitudeLongitude(newAddrRoad, newAddrDetail);
			bakery.setLatitude(latLng[0]);
			bakery.setLongitude(latLng[1]);
		}

		// ✅ 가게 이미지 저장 (파일이 있는 경우)
		if (bakeryImage != null && !bakeryImage.isEmpty()) {
			try {
				String bakeryImageUrl = imageService.saveImage(bakeryImage); // 새 이미지 저장
				if (bakeryImageUrl != null) {
					bakery.setBakeryImageUrl(bakeryImageUrl);
				}
			} catch (IOException e) {
				throw new CustomException(ErrorCode.BAKERY_IMAGE_UPLOAD_FAILED);
			}
		}

		// ✅ 배경 이미지 저장 (파일이 있는 경우)
		if (bakeryBackgroundImage != null && !bakeryBackgroundImage.isEmpty()) {
			try {
				String bakeryBackgroundImageUrl = imageService.saveImage(bakeryBackgroundImage); // 새 이미지 저장
				if (bakeryBackgroundImageUrl != null) {
					bakery.setBakeryBackgroundImgUrl(bakeryBackgroundImageUrl);
				}
			} catch (IOException e) {
				throw new CustomException(ErrorCode.BAKERY_BACKGROUND_IMAGE_UPLOAD_FAILED);
			}
		}

		// ✅ 수정 가능한 정보만 업데이트
		if (updates != null) {
			bakery.setName(Optional.ofNullable(updates.name()).orElse(bakery.getName()));
			bakery.setDescription(Optional.ofNullable(updates.description()).orElse(bakery.getDescription()));
		}
		bakery.setAddressRoad(newAddrRoad);
		bakery.setAddressDetail(newAddrDetail);
		bakery.setUpdatedAt(LocalDateTime.now());

		Bakery updatedBakery = bakeryRepository.save(bakery);
		return BakeryDto.from(updatedBakery);
	}

	// 가게 삭제 (Soft Delete)
	@Transactional
	public void delete(Bakery bakery) {
		bakery.setDeletedAt(LocalDateTime.now());
		bakeryRepository.save(bakery);
	}


	// 키워드로 가게 검색 (삭제된 가게 제외)
	@Transactional(readOnly = true)
	public Page<BakeryDetailDto> searchByKeyword(CustomUserDetails userDetails, String keyword, Pageable pageable) {
		if (keyword == null || keyword.trim().isEmpty()) {
			throw new CustomException(ErrorCode.NO_KEYWORD_ENTERED);
		}

		// 사용자 위치 정보 추출
		final Double userLat = Optional.ofNullable(userDetails)
			.filter(u -> u.getLatitude() != 0.0)
			.map(CustomUserDetails::getLatitude)
			.orElse(null);

		final Double userLng = Optional.ofNullable(userDetails)
			.filter(u -> u.getLongitude() != 0.0)
			.map(CustomUserDetails::getLongitude)
			.orElse(null);

		return bakeryRepository.searchByKeyword(keyword, pageable)
			.map(bakery -> {
				double distance = (userLat == null || userLng == null) ? 0.0
					: calculateDistance(userLat, userLng, bakery.getLatitude(), bakery.getLongitude());
				boolean is_liked = favoriteRepository.existsByUser_UserIdAndBakery_BakeryId(userDetails.getUserId(), bakery.getBakeryId());
				PickupTimeDto pickupTime = bakeryPickupService.getPickupTimetable(bakery.getBakeryId());

				LocalDate today = LocalDate.now();
				LocalDateTime startOfToday = today.atStartOfDay();
				LocalDateTime endOfToday = today.plusDays(1).atStartOfDay();

				BreadPackage breadPackage = breadPackageRepository.findByBakeryIdAndToday(bakery.getBakeryId(), startOfToday, endOfToday);
				int price = 0;
				if (breadPackage != null) {
					price = breadPackage.getPrice();
				}
				return BakeryDetailDto.from(bakery, distance, is_liked, pickupTime, price);
			});
	}

	// 중복 체크
	private void validateDuplicateBakery(String name, String businessRegistrationNumber, Long bakeryId) {
		boolean existsByName = bakeryRepository.existsByName(name);
		boolean existsByBusinessRegistrationNumber = bakeryRepository.existsByBusinessRegistrationNumber(businessRegistrationNumber);

		if (existsByName) {
			throw new CustomException(ErrorCode.BAKERY_NAME_ALREADY_IN_USE);
		}

		if (existsByBusinessRegistrationNumber) {
			throw new CustomException(ErrorCode.NUMBER_ALREADY_IN_USE);
		}
	}

	// 모든 가게의 좌표 조회
	@Transactional(readOnly = true)
	public List<BakeryLocationDto> findAllBakeryLocations() {
		List<Bakery> bakeries = bakeryRepository.findByDeletedAtIsNull(); // 삭제되지 않은 가게만 조회

		return bakeries.stream()
			.map(BakeryLocationDto::from)
			.collect(Collectors.toList());
	}


	/**
	 * 가게 아이디로 정산 정보 조회 메서드
	 */
	public BakerySettlementDto getBakerySettlement(CustomUserDetails userDetails, Long bakeryId) {
		/* 아래 코드는 필요하면 활성화 */
		// Bakery bakery = bakeryRepository.findById(bakeryId)
		// 	.orElseThrow(() -> new CustomException(ErrorCode.BAKERY_NOT_FOUND));
		// if (!bakery.getUser().getUserId().equals(userDetails.getUserId())) {
		// 	throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
		// }
		// log.info("✅ 현재 로그인한 사용자와 {}번 가게의 사장님이 일치함", bakeryId);

		Settlement settlement = settlementRepository.findByUser_UserId(userDetails.getUserId())
			.orElseThrow(() -> new CustomException(ErrorCode.SETTLEMENT_NOT_FOUND));
		log.info("🩵 정산 정보 조회 완료 🩵");
		return BakerySettlementDto.from(settlement);
	}

	@Transactional
	public void updateBakerySettlement(CustomUserDetails userDetails, SettlementUpdate request) {
		User user = userRepository.findById(userDetails.getUserId())
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		if (!user.getRole().equals(Role.OWNER)) {
			throw new CustomException(ErrorCode.USER_NOT_BAKERY_OWNER);
		}

		Settlement settlement = settlementRepository.findByUser_UserId(user.getUserId())
			.orElseThrow(() -> new CustomException(ErrorCode.SETTLEMENT_NOT_FOUND));

		// 요청된 필드만 업데이트 (null이 아닌 경우만 반영)
		if (request.bankName() != null) settlement.setBankName(request.bankName());
		if (request.accountHolderName() != null) settlement.setAccountHolderName(request.accountHolderName());
		if (request.accountNumber() != null) settlement.setAccountNumber(request.accountNumber());
		if (request.emailForTaxInvoice() != null) settlement.setEmailForTaxInvoice(request.emailForTaxInvoice());
		if (request.businessLicenseFileUrl() != null) settlement.setBusinessLicenseFileUrl(request.businessLicenseFileUrl());
	}
}
