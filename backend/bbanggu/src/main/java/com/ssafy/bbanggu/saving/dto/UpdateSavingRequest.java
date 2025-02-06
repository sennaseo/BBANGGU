package com.ssafy.bbanggu.saving.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * 절약 정보 갱신 요청 (유효성 검증 추가)
 */
public record UpdateSavingRequest(
	@NotNull(message = "reducedCo2e는 필수입니다.")
	@Min(value = 0, message = "reducedCo2e는 0 이상이어야 합니다.")
	int reducedCo2e,
	@NotNull(message = "savedMoney는 필수입니다.")
	@Min(value = 0, message = "savedMoney는 0 이상이어야 합니다.")
	int savedMoney
) {}
