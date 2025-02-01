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

	@NotBlank(message = "Email cannot be blank.") // 이메일이 비어 있으면 안 됨
	@Email(message = "Invalid email format.")     // 이메일 형식(@ 포함)을 체크
	@Schema(description = "User's email address", example = "user@example.com")
	String email

) {}
