package com.ssafy.bbanggu.saving.dto;

import lombok.Builder;

public record SavingDto(
	int savedMoney,
	int reducedCo2e
) {
	@Builder
	public SavingDto {
	}
}
