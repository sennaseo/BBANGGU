package com.ssafy.bbanggu.common.exception;

/**
 * TooManyRequestsException
 * - 사용자가 일정 시간 내에 너무 많은 요청을 보냈을 때 발생하는 예외
 */
public class TooManyRequestsException extends RuntimeException {
	public TooManyRequestsException(String message) {
		super(message);
	}
}
