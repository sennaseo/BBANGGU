package com.ssafy.bbanggu.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * EmailVerifyRequest
 * - 사용자가 입력한 이메일과 인증번호를 서버로 전송하는 요청 DTO
 * - 입력값 검증을 수행하여 올바른 값이 입력되었는지 확인
 */
public record EmailVerifyRequest(

	@NotBlank(message = "The required field 'Email' is missing.")
	@Email(message = "Invalid email format.")
	String email,

	@NotBlank(message = "The required field 'authCode' is missing.")
	String authCode

) {}
