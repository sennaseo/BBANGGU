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
	public Page<BakeryDetailDto> getAllBakeries(String sortBy, String sortOrder, Pageable pageable) {
		Sort.Direction direction = sortOrder.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
		Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(direction, sortBy));

		return bakeryRepository.findAllByDeletedAtIsNull(sortedPageable)
			.map(BakeryDetailDto::from);
	}

	// ID로 가게 조회
	@Transactional(readOnly = true)
	public BakeryDetailDto findById(Long id) {
		Bakery bakery = bakeryRepository.findByBakeryIdAndDeletedAtIsNull(id); // 삭제되지 않은 것만;
		if (bakery == null) {
			throw new CustomException(ErrorCode.BAKERY_NOT_FOUND);
		}
		return BakeryDetailDto.from(bakery);
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
	public BakeryDto update(String curEmail, Long bakery_id, BakeryDto updates) {
		Bakery bakery = bakeryRepository.findByBakeryIdAndDeletedAtIsNull(bakery_id); // 삭제되지 않은 것만
		if (bakery == null) {
			throw new CustomException(ErrorCode.BAKERY_NOT_FOUND);
		}

		// ✅ 현재 로그인한 사용자가 이 가게의 주인인지 검증
		if (!bakery.getUser().getEmail().equals(curEmail)) {
			throw new CustomException(ErrorCode.NO_PERMISSION_TO_EDIT_BAKERY);
		}

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
	public Page<BakeryDto> searchByKeyword(String keyword, Pageable pageable) {
		if (keyword == null || keyword.trim().isEmpty()) {
			throw new IllegalArgumentException("검색어를 입력해주세요.");
		}

		return bakeryRepository.searchByKeyword(keyword, pageable) // 삭제된 가게 제외
			.map(BakeryDto::from);
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
