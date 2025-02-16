package com.ssafy.bbanggu.ai.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventoryItemDto {
	private Long breadId;
	private int quantity;
	private LocalDate createdAt;
}
