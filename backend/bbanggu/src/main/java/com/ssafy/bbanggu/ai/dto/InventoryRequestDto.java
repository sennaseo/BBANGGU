package com.ssafy.bbanggu.ai.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InventoryRequestDto {
	private String storeName;
	private List<InventoryItemDto> items;
}
