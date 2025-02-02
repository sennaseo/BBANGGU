package com.ssafy.bbanggu.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
	@NotBlank(message = "필수 입력란인 이메일이 입력되지 않았습니다.")
	@Email(message = "이메일 형식이 잘못되었습니다.")
	private String email;

	@NotBlank(message = "필수 입력란인 비밀번호가 입력되지 않았습니다.")
	private String password;
}
