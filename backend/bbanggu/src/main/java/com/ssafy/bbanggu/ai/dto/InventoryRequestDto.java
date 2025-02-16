package com.ssafy.bbanggu.ai.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Collections;
import java.util.List;

@Getter
@Setter
public class InventoryRequestDto {
	private String storeName;
	private List<InventoryItemDto> items;

	// ✅ storeName을 안전하게 가져오는 getter 추가
	public String getStoreName() {
		return storeName != null ? storeName : "알 수 없는 가게";
	}

	// ✅ items가 null이면 빈 리스트 반환하여 NullPointerException 방지
	public List<InventoryItemDto> getItems() {
		return items != null ? items : Collections.emptyList();
	}
}
