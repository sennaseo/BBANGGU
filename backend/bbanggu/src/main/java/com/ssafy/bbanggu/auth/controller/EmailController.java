package com.ssafy.bbanggu.auth.controller;

import com.ssafy.bbanggu.auth.dto.EmailRequest;
import com.ssafy.bbanggu.auth.dto.ApiResponse;
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
	@Operation(summary = "이메일 인증번호 요청", description = "사용자가 입력한 이메일로 인증번호를 전송합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200", description = "인증번호 전송 성공"
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "400", description = "잘못된 이메일 형식"
		),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "429", description = "요청 제한 초과"
		)
	})
	@PostMapping("/send")
	public ResponseEntity<ApiResponse> sendEmail(@RequestBody @Valid EmailRequest request) {
		try {
			emailService.sendAuthenticationCode(request.email());
			return ResponseEntity.ok(new ApiResponse("Authentication code sent successfully."));
		} catch (TooManyRequestsException e) {
			return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
				.body(new ApiResponse(e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ApiResponse(e.getMessage()));
		}
	}

	/**
	 * 이메일 인증 확인 API
	 *
	 * @param request 이메일 인증 확인 요청 DTO
	 * @return 성공 메시지 또는 에러 응답
	 */
	@Operation(summary = "이메일 인증 확인", description = "사용자가 입력한 인증번호를 검증합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "이메일 인증 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "410", description = "인증번호 만료"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "잘못된 인증번호")
	})
	@PostMapping("/verify")
	public ResponseEntity<ApiResponse> verifyEmail(@RequestBody @Valid EmailVerifyRequest request) {
		try {
			emailService.verifyAuthenticationCode(request.email(), request.authCode());
			return ResponseEntity.ok(new ApiResponse("Email verified successfully."));
		} catch (CodeExpiredException e) {
			return ResponseEntity.status(HttpStatus.GONE)
				.body(new ApiResponse(e.getMessage()));
		} catch (InvalidCodeException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new ApiResponse(e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ApiResponse("Invalid request."));
		}
	}
}
