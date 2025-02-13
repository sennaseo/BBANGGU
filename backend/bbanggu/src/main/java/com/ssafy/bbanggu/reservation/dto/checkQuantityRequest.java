package com.ssafy.bbanggu.reservation.dto;

import jakarta.validation.constraints.NotNull;

public record checkQuantityRequest(
	@NotNull(message = "필수 필드인 '빵꾸러미 ID'가 없습니다.")
	Long breadPackageId,
	@NotNull(message = "필수 필드인 '빵꾸러미 개수'가 없습니다.")
	int quantity
) {}
