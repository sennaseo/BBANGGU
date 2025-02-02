package com.ssafy.bbanggu.bakery;

import com.ssafy.bbanggu.bakery.dto.BakeryDto;
import com.ssafy.bbanggu.bakery.dto.BakeryLocationDto;
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
	public BakeryDto save(Bakery bakery) {
		validateDuplicateBakery(bakery.getName(), bakery.getBusinessRegistrationNumber(), null);

		bakery.setCreatedAt(LocalDateTime.now());
		bakery.setUpdatedAt(LocalDateTime.now());

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
		if (bakeryId == null) {
			if (bakeryRepository.existsByBusinessRegistrationNumber(businessRegistrationNumber)) {
				throw new IllegalArgumentException("이미 존재하는 사업자 등록 번호입니다.");
			}
			if (bakeryRepository.existsByName(name)) {
				throw new IllegalArgumentException("이미 존재하는 가게 이름입니다.");
			}
		} else {
			if (bakeryRepository.existsByBusinessRegistrationNumberAndBakeryIdNot(businessRegistrationNumber, bakeryId)) {
				throw new IllegalArgumentException("이미 존재하는 사업자 등록 번호입니다.");
			}
			if (bakeryRepository.existsByNameAndBakeryIdNot(name, bakeryId)) {
				throw new IllegalArgumentException("이미 존재하는 가게 이름입니다.");
			}
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
