package com.ssafy.bbanggu.common.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ssafy.bbanggu.common.response.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(DuplicateEmailException.class)
	public ResponseEntity<ApiResponse> handleDuplicateEmailException(DuplicateEmailException e) {
		return ResponseEntity.status(e.getStatus())
			.body(new ApiResponse(409, e.getMessage()));
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ApiResponse> handleValidationException(ConstraintViolationException e) {
		String errorMessage = e.getMessage().split(":")[1].trim();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(new ApiResponse(400, errorMessage));
	}
}
