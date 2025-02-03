package com.ssafy.bbanggu.saving.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class TotalSavingResponse {
	private final int totalSavedMoney;
	private final int totalReducedCo2e;
}

