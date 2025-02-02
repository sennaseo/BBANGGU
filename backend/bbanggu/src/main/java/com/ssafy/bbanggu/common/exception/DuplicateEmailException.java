package com.ssafy.bbanggu.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.Getter;

@Getter
@ResponseStatus
public class DuplicateEmailException extends RuntimeException {

	private final HttpStatus status;

	public DuplicateEmailException(HttpStatus status, String message) {
		super(message);
		this.status = status;
	}

}
