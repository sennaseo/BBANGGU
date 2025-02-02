package com.ssafy.bbanggu.common.response;

/**
 * ApiResponse
 * - API 요청에 대한 응답 메시지를 감싸는 DTO
 * - 클라이언트에게 JSON 형태로 응답을 제공
 */
public record ApiResponse(
	int statusCode,
	String message
) {}
