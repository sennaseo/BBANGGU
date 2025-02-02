package com.ssafy.bbanggu.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * EmailVerifyRequest
 * - 사용자가 입력한 이메일과 인증번호를 서버로 전송하는 요청 DTO
 * - 입력값 검증을 수행하여 올바른 값이 입력되었는지 확인
 */
public record EmailVerifyRequest(

<<<<<<< HEAD
	@NotBlank(message = "Email cannot be blank.") // 이메일이 비어 있으면 에러 발생
	@Email(message = "Invalid email format.")     // 이메일 형식(@ 포함) 체크
	String email,

	@NotBlank(message = "Authentication code cannot be blank.") // 인증번호가 비어 있으면 에러 발생
=======
	@NotBlank(message = "The required field 'Email' is missing.")
	@Email(message = "Invalid email format.")
	String email,

	@NotBlank(message = "The required field 'authCode' is missing.")
>>>>>>> origin/develop
	String authCode

) {}
