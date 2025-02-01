package com.ssafy.bbanggu.user.dto;

import com.ssafy.bbanggu.user.domain.User;

import jakarta.validation.constraints.NotBlank;

/**
 * 회원가입 요청 DTO
 * 클라이언트에서 사용자 등록 요청 데이터를 전달받음
 */
public record CreateUserRequest(
	@NotBlank(message = "The required field 'Name' is missing.")
	String name,
	@NotBlank(message = "The required field 'Email' is missing.")
	String email,
	@NotBlank(message = "The required field 'password' is missing.")
	String password,
	String phoneNumber,
	@NotBlank(message = "The required field 'userType' is missing.")
	String userType
) {
	/**
	 * CreateUserRequest 데이터를 User 엔티티로 변환
	 * @return User 엔티티 객체
	 */
	public User toEntity() {
		return new User(name, email, null, password, phoneNumber, userType);
	}
}