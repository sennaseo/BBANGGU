package com.ssafy.bbanggu.saving.dto;

import lombok.Builder;

public record SavingResponse(
	int savedMoney,
	int reducedCo2e
) {
	@Builder
	public SavingResponse {
	}
}
