package com.ssafy.bbanggu.stock;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class StockDTO {
	private Long stockId;
	private Long bakeryId;
	private Long breadId;
	private Integer quantity;
	private LocalDate date;
}
