package com.ssafy.bbanggu.common.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {
	private int code;
	private final HttpStatus status;
	private final String message;

	public CustomException(ErrorCode errorCode) {
		super(errorCode.getMessage());
		this.code = errorCode.getCode();
		this.status = errorCode.getStatus();
		this.message = errorCode.getMessage();
	}
}
