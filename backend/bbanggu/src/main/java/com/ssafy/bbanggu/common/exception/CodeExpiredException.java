package com.ssafy.bbanggu.common.exception;

/**
 * CodeExpiredException
 * - 사용자가 입력한 인증번호가 만료된 경우 발생하는 예외
 */
public class CodeExpiredException extends RuntimeException {
	public CodeExpiredException(String message) {
		super(message);
	}
}
