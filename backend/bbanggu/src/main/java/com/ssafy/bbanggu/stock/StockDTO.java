package com.ssafy.bbanggu.stock;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StockDTO {
	private Long stockId;
	private Long bakeryId;
	private Long breadId;
	private Integer quantity;
}
