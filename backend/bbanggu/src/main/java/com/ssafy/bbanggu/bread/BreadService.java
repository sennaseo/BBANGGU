package com.ssafy.bbanggu.bread;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.bbanggu.bakery.domain.Bakery;
import com.ssafy.bbanggu.util.image.ImageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class BreadService {

	private final BreadRepository breadRepository;
	private final ImageService imageService;

	public Bread insertBread(BreadDTO breadDto, MultipartFile file) throws IOException {
		// id 유효성 검사가 필요 없으면 아래 코드 적용(프록시 방식)
		Bakery bakery = Bakery.builder()
			.bakeryId(breadDto.getBakeryId())
			.build();

		BreadCategory breadCategory = BreadCategory.builder()
			.breadCategoryId(breadDto.getBreadCategoryId())
			.build();

		// id 유효성 검사가 필요하면 아래 코드 적용
		// Bakery bakery = bakeryRepository.findById(breadDto.getBakeryId())
		// 	.orElseThrow(() -> new IllegalArgumentException("해당 bakeryId가 존재하지 않습니다."));
		// BreadCategory breadCategory = breadCategoryRepository.findById(breadDto.getBreadCategoryId())
		// 	.orElseThrow(() -> new IllegalArgumentException("해당 bakeryId가 존재하지 않습니다."));

		Bread bread = Bread.builder()
			.bakery(bakery)
			.breadCategory(breadCategory)
			.name(breadDto.getName())
			.price(breadDto.getPrice())
			.createdAt(LocalDateTime.now())
			.build();

		if (file != null && !file.isEmpty()) {
			bread.setBreadImageUrl(imageService.saveImage(file));
		} else {
			bread.setBreadImageUrl(null);
		}

		return breadRepository.save(bread);
	}

	public BreadDTO getBread(long breadId) {
		Bread bread = breadRepository.findById(breadId).orElse(null);
		BreadDTO breadDTO = entityToDTO(bread);
		if (breadDTO != null) {
			String imageUrl = bread.getBreadImageUrl();
			if (imageUrl != null && !imageUrl.isEmpty()) {
				breadDTO.setBreadImageUrl(imageUrl.replace("\\", "/"));
			} else {
				breadDTO.setBreadImageUrl(null);
			}
		}
		return breadDTO;
	}

	public List<BreadDTO> getBreadByBakeryId(long bakeryId) {
		List<Bread> breads = breadRepository.findByBakery_BakeryIdAndDeletedAtIsNull(bakeryId);
		List<BreadDTO> breadDTOList = new ArrayList<>();
		for (Bread bread : breads) {
			breadDTOList.add(entityToDTO(bread));
		}
		return breadDTOList;
	}

	public void deleteBread(long breadId) {
		Bread bread = breadRepository.findById(breadId)
			.orElseThrow(() -> new RuntimeException("Bread not found"));
		bread.setDeletedAt(LocalDateTime.now());
	}

	private BreadDTO entityToDTO(Bread bread) {
		return BreadDTO.builder()
			.breadCategoryId(bread.getBreadCategory().getBreadCategoryId())
			.name(bread.getName())
			.price(bread.getPrice())
			.bakeryId(bread.getBakery().getBakeryId())
			.build();
	}
}
