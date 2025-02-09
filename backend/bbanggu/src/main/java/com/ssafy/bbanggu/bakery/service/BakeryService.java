package com.ssafy.bbanggu.bakery.service;

import com.ssafy.bbanggu.bakery.Bakery;
import com.ssafy.bbanggu.bakery.BakeryRepository;
import com.ssafy.bbanggu.bakery.dto.BakeryDetailDto;
import com.ssafy.bbanggu.bakery.dto.BakeryDto;
import com.ssafy.bbanggu.bakery.dto.BakeryLocationDto;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BakeryService {

	private final BakeryRepository bakeryRepository;
	private final GeoService geoService;
	private final UserRepository userRepository;

	// 삭제되지 않은 모든 가게 조회
	@Transactional(readOnly = true)
	public List<BakeryDetailDto> getAllBakeries(String sortBy, String sortOrder, Pageable pageable, double userLat, double userLng) {
		Sort.Direction direction = sortOrder.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;

		// ✅ 1. JPA에서 SQL 정렬 & 페이징 적용 (distance가 아닌 경우)
		if (!"distance".equals(sortBy)) {
			Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(direction, sortBy));
			return bakeryRepository.findAllByDeletedAtIsNull(sortedPageable)
				.stream()
				.map(bakery -> {
					double distance = calculateDistance(userLat, userLng, bakery.getLatitude(), bakery.getLongitude());
					return BakeryDetailDto.from(bakery, distance);
				})
				.collect(Collectors.toList());
		}

		// ✅ 2. distance 정렬이 필요한 경우: JPA는 단순 조회, Java에서 정렬 후 페이징
		List<BakeryDetailDto> bakeries = bakeryRepository.findAllByDeletedAtIsNull(pageable)
			.stream()
			.map(bakery -> {
				double distance = calculateDistance(userLat, userLng, bakery.getLatitude(), bakery.getLongitude());
				return BakeryDetailDto.from(bakery, distance);
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
	public BakeryDetailDto findById(Long bakery_id, double userLat, double userLng) {
		Bakery bakery = bakeryRepository.findByBakeryIdAndDeletedAtIsNull(bakery_id); // 삭제되지 않은 것만;
		if (bakery == null) {
			throw new CustomException(ErrorCode.BAKERY_NOT_FOUND);
		}

		// ✅ 사용자 위치 기반 거리 계산
		double distance = calculateDistance(userLat, userLng, bakery.getLatitude(), bakery.getLongitude());
		return BakeryDetailDto.from(bakery, distance);
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
	public BakeryDto createBakery(BakeryDto bakeryDto) {
		validateDuplicateBakery(bakeryDto.name(), bakeryDto.businessRegistrationNumber(), null);

		// 사용자 조회 (userId로 User 찾기)
		User user = userRepository.findById(bakeryDto.userId())
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// 주소 기반 위경도 가져오기
		double[] latLng = getLatitudeLongitude(bakeryDto.addressRoad(), bakeryDto.addressDetail());
		double latitude = latLng[0];
		double longitude = latLng[1];

		// Dto -> Entity 변환
		Bakery bakery = Bakery.builder()
				.name(bakeryDto.name())
				.description(bakeryDto.description())
				.photoUrl(bakeryDto.photoUrl())
				.addressRoad(bakeryDto.addressRoad())
				.addressDetail(bakeryDto.addressDetail())
				.businessRegistrationNumber(bakeryDto.businessRegistrationNumber())
				.latitude(latitude)
				.longitude(longitude)
				.user(user)
				.build();

		Bakery savedBakery = bakeryRepository.save(bakery);
		return BakeryDto.from(savedBakery);
	}

	// 가게의 위도, 경도 추출
	private double[] getLatitudeLongitude(String addressRoad, String addressDetail) {
		// 전체 주소 문자열 생성 (도로명주소 + 상세주소)
		String fullAddress = addressRoad + " " + addressDetail;

		// 주소 기반 위경도 가져오기
		double[] latLng = geoService.getLatLngFromAddress(fullAddress);
		return latLng;
	}

	// 가게 수정
	@Transactional
	public BakeryDto update(Bakery bakery, BakeryDto updates) {
		// ✅ 수정하려는 가게명 중복 검사
		if (updates.name() != null && bakeryRepository.existsByNameAndBakeryIdNot(updates.name(), bakery.getBakeryId())) {
			throw new CustomException(ErrorCode.BAKERY_NAME_ALREADY_IN_USE);
		}

		// ✅ 주소 변경 확인 후 위경도 업데이트
		String newAddrRoad = Optional.ofNullable(updates.addressRoad()).orElse(bakery.getAddressRoad());
		String newAddrDetail = Optional.ofNullable(updates.addressDetail()).orElse(bakery.getAddressDetail());

		if (!newAddrRoad.equals(bakery.getAddressRoad()) || !newAddrDetail.equals(bakery.getAddressDetail())) {
			double[] latLng = getLatitudeLongitude(newAddrRoad, newAddrDetail);
			bakery.setLatitude(latLng[0]);
			bakery.setLongitude(latLng[1]);
		}

		// ✅ 수정 가능한 정보만 업데이트
		bakery.setName(Optional.ofNullable(updates.name()).orElse(bakery.getName()));
		bakery.setDescription(Optional.ofNullable(updates.description()).orElse(bakery.getDescription()));
		bakery.setAddressRoad(newAddrRoad);
		bakery.setAddressDetail(newAddrDetail);
		bakery.setPhotoUrl(Optional.ofNullable(updates.photoUrl()).orElse(bakery.getPhotoUrl()));
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
	public Page<BakeryDetailDto> searchByKeyword(String keyword, Pageable pageable, double userLat, double userLng) {
		if (keyword == null || keyword.trim().isEmpty()) {
			throw new CustomException(ErrorCode.NO_KEYWORD_ENTERED);
		}

		return bakeryRepository.searchByKeyword(keyword, pageable)
			.map(bakery -> {
				double distance = calculateDistance(userLat, userLng, bakery.getLatitude(), bakery.getLongitude());
				return BakeryDetailDto.from(bakery, distance);
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
}
