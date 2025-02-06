package com.ssafy.bbanggu.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

/**
 * EmailRequest
 * - 사용자가 이메일 인증을 요청할 때, 이메일 값을 담는 요청 DTO
 * - 입력된 이메일 값을 검증
 */
public record EmailRequest(
	@NotBlank(message = "필수 입력란인 Email 필드가 입력되지 않았습니다.")
	@Email(message = "유효하지 않은 이메일 형식입니다.")
	@Getter
	String email
) {}
