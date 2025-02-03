package com.ssafy.bbanggu.common.response;

public record ErrorResponse(
	int code,
	String status,
	String message
) {}
