package com.ssafy.bbanggu.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * EmailRequest
 * - 사용자가 이메일 인증을 요청할 때, 이메일 값을 담는 요청 DTO
 * - 입력된 이메일 값을 검증
 */
public record EmailRequest(
	@NotBlank(message = "Email cannot be blank.")
	@Email(message = "Invalid email format.")
	String email
) {}
