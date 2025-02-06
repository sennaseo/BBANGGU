package com.ssafy.bbanggu.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * EmailVerifyRequest
 * - 사용자가 입력한 이메일과 인증번호를 서버로 전송하는 요청 DTO
 * - 입력값 검증을 수행하여 올바른 값이 입력되었는지 확인
 */
public record EmailVerifyRequest(

	@NotBlank(message = "필수 입력란인 Email 필드가 입력되지 않았습니다.")
	@Email(message = "유효한 이메일 형식이 아닙니다.")
	String email,

	@NotBlank(message = "필수 입력란인 AuthCode 필드가 입력되지 않았습니다.")
	String authCode

) {}
