package com.ssafy.bbanggu.common.exception;

/**
 * InvalidCodeException
 * - 사용자가 입력한 인증번호가 잘못된 경우 발생하는 예외
 */
public class InvalidCodeException extends RuntimeException {
	public InvalidCodeException(String message) {
		super(message);
	}
}
