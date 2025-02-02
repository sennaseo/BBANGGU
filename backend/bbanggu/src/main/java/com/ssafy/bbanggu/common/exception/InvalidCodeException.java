package com.ssafy.bbanggu.common.exception;

/**
 * InvalidCodeException
 * - 사용자가 입력한 인증번호가 잘못된 경우 발생하는 예외
 */
public class InvalidCodeException extends RuntimeException {
<<<<<<< HEAD

	/**
	 * 생성자 (예외 메시지를 받아 부모 클래스에 전달)
	 *
	 * @param message 예외 메시지
	 */
=======
>>>>>>> origin/develop
	public InvalidCodeException(String message) {
		super(message);
	}
}
