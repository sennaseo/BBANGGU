package com.ssafy.bbanggu.common.exception;

/**
 * CodeExpiredException
 * - 사용자가 입력한 인증번호가 만료된 경우 발생하는 예외
 */
public class CodeExpiredException extends RuntimeException {

	/**
	 * 생성자 (예외 메시지를 받아 부모 클래스에 전달)
	 *
	 * @param message 예외 메시지
	 */
	public CodeExpiredException(String message) {
		super(message);
	}
}
