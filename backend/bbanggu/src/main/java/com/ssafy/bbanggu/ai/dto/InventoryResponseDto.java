package com.ssafy.bbanggu.ai.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class InventoryResponseDto {
	private String message;
	private String analysis;
}
