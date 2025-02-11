package com.ssafy.bbanggu.user.dto;

import com.ssafy.bbanggu.user.Role;
import com.ssafy.bbanggu.user.domain.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * 회원가입 요청 DTO
 * 클라이언트에서 사용자 등록 요청 데이터를 전달받음
 */
public record CreateUserRequest(
	@NotBlank(message = "필수 입력 필드 '이름'이 입력되지 않았습니다.")
	String name,

	@NotBlank(message = "필수 입력 필드 '이메일'이 입력되지 않았습니다.")
	@Email(message = "유효하지 않은 이메일 형식입니다.")
	String email,

	@NotBlank(message = "필수 입력 필드 '비밀번호'가 입력되지 않았습니다.")
	String password,

	String phone,

	@NotBlank(message = "필수 입력 필드 '사용자 타입'이 입력되지 않았습니다.")
	String userType
) {
	/**
	 * CreateUserRequest 데이터를 User 엔티티로 변환
	 * @return User 엔티티 객체
	 */
	public User toEntity() {
		return new User(name, email, null, password, phone, Role.valueOf(userType));
	}
}
