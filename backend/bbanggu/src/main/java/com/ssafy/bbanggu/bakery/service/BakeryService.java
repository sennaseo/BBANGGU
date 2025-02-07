package com.ssafy.bbanggu.bakery.service;

import com.ssafy.bbanggu.bakery.Bakery;
import com.ssafy.bbanggu.bakery.BakeryRepository;
import com.ssafy.bbanggu.bakery.dto.BakeryDto;
import com.ssafy.bbanggu.bakery.dto.BakeryLocationDto;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;

import jdk.swing.interop.SwingInterOpUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BakeryService {

	private final BakeryRepository bakeryRepository;
	private final GeoService geoService;
	private final UserRepository userRepository;

	// 삭제되지 않은 모든 가게 조회
	@Transactional(readOnly = true)
	public List<BakeryDto> findAll() {
		return bakeryRepository.findByDeletedAtIsNull() // 삭제되지 않은 가게만 조회
			.stream()
			.map(BakeryDto::from)
			.collect(Collectors.toList());
	}

	// ID로 가게 조회
	@Transactional(readOnly = true)
	public BakeryDto findById(Long id) {
		Bakery bakery = bakeryRepository.findByBakeryIdAndDeletedAtIsNull(id); // 삭제되지 않은 것만;
		if (bakery == null) {
			throw new IllegalArgumentException("가게를 찾을 수 없습니다. ID: " + id);
		}
		return BakeryDto.from(bakery);
	}

	// 가게 추가
	@Transactional
	public BakeryDto createBakery(BakeryDto bakeryDto) {
		validateDuplicateBakery(bakeryDto.name(), bakeryDto.businessRegistrationNumber(), null);

		// 사용자 조회 (userId로 User 찾기)
		User user = userRepository.findById(bakeryDto.userId())
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// 전체 주소 문자열 생성 (도로명주소 + 상세주소)
		String fullAddress = bakeryDto.addressRoad() + " " + bakeryDto.addressDetail();

		// 주소 기반 위경도 가져오기
		double[] latLng = geoService.getLatLngFromAddress(fullAddress);
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

	// 가게 수정
	@Transactional
	public BakeryDto update(Long id, Bakery bakery) {
		Bakery existingBakery = bakeryRepository.findByBakeryIdAndDeletedAtIsNull(id); // 삭제되지 않은 것만
		if (existingBakery == null) {
			throw new IllegalArgumentException("가게를 찾을 수 없습니다. ID: " + id);
		}

		validateDuplicateBakery(bakery.getName(), bakery.getBusinessRegistrationNumber(), id);

		existingBakery.setName(bakery.getName());
		existingBakery.setDescription(bakery.getDescription());
		existingBakery.setBusinessRegistrationNumber(bakery.getBusinessRegistrationNumber());
		existingBakery.setAddressRoad(bakery.getAddressRoad());
		existingBakery.setAddressDetail(bakery.getAddressDetail());
		existingBakery.setPhotoUrl(bakery.getPhotoUrl());
		existingBakery.setLatitude(bakery.getLatitude());
		existingBakery.setLongitude(bakery.getLongitude());

		existingBakery.setUpdatedAt(LocalDateTime.now());

		Bakery updatedBakery = bakeryRepository.save(existingBakery);
		return BakeryDto.from(updatedBakery);
	}


	// 가게 삭제 (Soft Delete)
	@Transactional
	public String delete(Long id) {
		Bakery bakery = bakeryRepository.findByBakeryIdAndDeletedAtIsNull(id); // 삭제되지 않은 것만
		if (bakery == null) {
			throw new IllegalArgumentException("가게를 찾을 수 없습니다. ID: " + id);
		}

		bakery.setDeletedAt(LocalDateTime.now());
		bakeryRepository.save(bakery);

		return "가게 " + id + " 를 삭제했습니다.";
	}


	// 키워드로 가게 검색 (삭제된 가게 제외)
	@Transactional(readOnly = true)
	public List<BakeryDto> searchByKeyword(String keyword) {
		if (keyword == null || keyword.trim().isEmpty()) {
			throw new IllegalArgumentException("검색어를 입력해주세요.");
		}

		return bakeryRepository.findByNameContainingAndDeletedAtIsNull(keyword) // 삭제된 가게 제외
			.stream()
			.map(BakeryDto::from)
			.collect(Collectors.toList());
	}

	// 중복 체크
	private void validateDuplicateBakery(String name, String businessRegistrationNumber, Long bakeryId) {
		boolean existsByName = bakeryRepository.existsByName(name);
		boolean existsByBusinessRegistrationNumber = bakeryRepository.existsByBusinessRegistrationNumber(businessRegistrationNumber);

		if (existsByName) {
			throw new CustomException(ErrorCode.STORENAME_ALREADY_IN_USE);
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
