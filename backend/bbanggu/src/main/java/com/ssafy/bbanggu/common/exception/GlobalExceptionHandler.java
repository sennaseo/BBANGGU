package com.ssafy.bbanggu.common.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ssafy.bbanggu.common.response.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(CustomException.class)
	public ResponseEntity<ApiResponse> handleCustomException(CustomException e) {
		return ResponseEntity.status(e.getStatus())
			.body(new ApiResponse(e.getCode(), e.getStatus().name(), e.getMessage()));
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ApiResponse> handleValidationException(ConstraintViolationException e) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(new ApiResponse(400, "Validation Error", e.getMessage()));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse> handleGenericException(Exception e) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.body(new ApiResponse(500, "Internal Server Error", e.getMessage()));
	}

}
