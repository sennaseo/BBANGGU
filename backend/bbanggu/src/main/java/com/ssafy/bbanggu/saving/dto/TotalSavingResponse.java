package com.ssafy.bbanggu.saving.dto;

/**
 * 전체 유저 절약 정보 반환
 */
public record TotalSavingResponse(
	int totalSavedMoney,
	int totalReducedCo2e
) {}
