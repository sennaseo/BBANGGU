package com.ssafy.bbanggu.auth.controller;

import com.ssafy.bbanggu.auth.dto.EmailRequest;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.auth.dto.EmailVerifyRequest;
import com.ssafy.bbanggu.common.exception.CodeExpiredException;
import com.ssafy.bbanggu.auth.service.EmailService;
import com.ssafy.bbanggu.common.exception.InvalidCodeException;
import com.ssafy.bbanggu.common.exception.TooManyRequestsException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth/email")
@Validated
public class EmailController {

	private final EmailService emailService;

	public EmailController(EmailService emailService) {
		this.emailService = emailService;
	}

	/**
	 * 이메일 인증번호 요청 API
	 *
	 * @param request 이메일 요청 DTO
	 * @return 성공 메시지 또는 에러 응답
	 */
	@PostMapping("/send")
	public ResponseEntity<ApiResponse> sendEmail(@RequestBody @Valid EmailRequest request) {
		System.out.println("📩 이메일 인증 요청 들어옴: " + request.email());
		try {
			emailService.sendAuthenticationCode(request.email());
			return ResponseEntity.ok(new ApiResponse(200, "Authentication code sent successfully."));
		} catch (TooManyRequestsException e) {
			return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
				.body(new ApiResponse(429, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ApiResponse(400, e.getMessage()));
		}
	}

	/**
	 * 이메일 인증 확인 API
	 *
	 * @param request 이메일 인증 확인 요청 DTO
	 * @return 성공 메시지 또는 에러 응답
	 */
	@PostMapping("/verify")
	public ResponseEntity<ApiResponse> verifyEmail(@RequestBody @Valid EmailVerifyRequest request) {
		try {
			emailService.verifyAuthenticationCode(request.email(), request.authCode());
			return ResponseEntity.ok(new ApiResponse(200, "Email verified successfully."));
		} catch (CodeExpiredException e) {
			return ResponseEntity.status(HttpStatus.GONE)
				.body(new ApiResponse(410, e.getMessage()));
		} catch (InvalidCodeException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new ApiResponse(401, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ApiResponse(400, "Invalid request."));
		}
	}
}
