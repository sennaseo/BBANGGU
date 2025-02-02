package com.ssafy.bbanggu.auth.controller;

import com.ssafy.bbanggu.auth.dto.EmailRequest;
<<<<<<< HEAD
import com.ssafy.bbanggu.auth.dto.ApiResponse;
=======
import com.ssafy.bbanggu.common.response.ApiResponse;
>>>>>>> origin/develop
import com.ssafy.bbanggu.auth.dto.EmailVerifyRequest;
import com.ssafy.bbanggu.common.exception.CodeExpiredException;
import com.ssafy.bbanggu.auth.service.EmailService;
import com.ssafy.bbanggu.common.exception.InvalidCodeException;
import com.ssafy.bbanggu.common.exception.TooManyRequestsException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
<<<<<<< HEAD
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

=======
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

>>>>>>> origin/develop
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
<<<<<<< HEAD
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
=======
	@PostMapping("/send")
	public ResponseEntity<ApiResponse> sendEmail(@Valid @RequestBody EmailRequest request, BindingResult result) {
		if (result.hasErrors()) {
			String errorMessage = result.getFieldErrors().get(0).getDefaultMessage();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ApiResponse(400, errorMessage));
		}

		try {
			emailService.sendAuthenticationCode(request.email());
			return ResponseEntity.ok(new ApiResponse(200, "Authentication code sent successfully."));
		} catch (TooManyRequestsException e) {
			return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
				.body(new ApiResponse(429, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ApiResponse(400, e.getMessage()));
>>>>>>> origin/develop
		}
	}

	/**
	 * 이메일 인증 확인 API
	 *
	 * @param request 이메일 인증 확인 요청 DTO
	 * @return 성공 메시지 또는 에러 응답
	 */
<<<<<<< HEAD
	@Operation(summary = "이메일 인증 확인", description = "사용자가 입력한 인증번호를 검증합니다.")
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "이메일 인증 성공"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "410", description = "인증번호 만료"),
		@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "잘못된 인증번호")
	})
=======
>>>>>>> origin/develop
	@PostMapping("/verify")
	public ResponseEntity<ApiResponse> verifyEmail(@RequestBody @Valid EmailVerifyRequest request) {
		try {
			emailService.verifyAuthenticationCode(request.email(), request.authCode());
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/develop
		}
	}
}
