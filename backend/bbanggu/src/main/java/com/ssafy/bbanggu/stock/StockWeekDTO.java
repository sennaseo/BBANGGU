package com.ssafy.bbanggu.stock;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class StockWeekDTO {
	private LocalDate date;
	private Integer totalQuantity;
}
