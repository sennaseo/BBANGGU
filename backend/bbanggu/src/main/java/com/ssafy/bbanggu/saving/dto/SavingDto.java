package com.ssafy.bbanggu.saving.dto;

import lombok.Builder;

public record SavingDto(
	int savedMoney,
	double reducedCo2e
) {
	@Builder
	public SavingDto {
	}
}
