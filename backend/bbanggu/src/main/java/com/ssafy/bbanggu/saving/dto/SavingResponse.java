package com.ssafy.bbanggu.saving.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
public class SavingResponse {
	private int reducedCo2e;
	private int savedMoney;

	@Builder
	public SavingResponse(int reducedCo2e, int savedMoney) {
		this.reducedCo2e = reducedCo2e;
		this.savedMoney = savedMoney;
	}
}
