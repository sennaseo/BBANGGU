package com.ssafy.bbanggu.user.dto;

import jakarta.validation.constraints.NotNull;

public record PasswordUpdateRequest (
	@NotNull(message = "필수 입력란인 '현재 비밀번호'가 없습니다.")
	String originPassword,
	@NotNull(message = "필수 입력란인 '새 비밀번호'가 없습니다.")
	String newPassword
){}
