package com.ssafy.bbanggu.auth.controller;

import com.ssafy.bbanggu.auth.dto.EmailRequest;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.auth.dto.EmailVerifyRequest;
import com.ssafy.bbanggu.auth.service.EmailService;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
	public ResponseEntity<ApiResponse> sendEmail(@Valid @RequestBody EmailRequest request, BindingResult result) {
		if (result.hasErrors()) {
			throw new CustomException(ErrorCode.BAD_REQUEST);
		}

		emailService.sendAuthenticationCode(request.email());
		return ResponseEntity.ok(new ApiResponse("인증코드가 성공적으로 전송되었습니다.", null));
	}

	/**
	 * 이메일 인증 확인 API
	 *
	 * @param request 이메일 인증 확인 요청 DTO
	 * @return 성공 메시지 또는 에러 응답
	 */
	@PostMapping("/verify")
	public ResponseEntity<ApiResponse> verifyEmail(@RequestBody @Valid EmailVerifyRequest request) {
		emailService.verifyAuthenticationCode(request.email(), request.authCode());
		return ResponseEntity.ok(new ApiResponse("이메일 인증이 완료되었습니다.", null));
	}
}
