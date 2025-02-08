package com.ssafy.bbanggu.user.dto;

import com.ssafy.bbanggu.user.domain.User;

/**
 * 사용자 응답 DTO
 * 사용자 데이터를 클라이언트로 전달하기 위해 사용
 */
public record UserResponse(
	Long userId,
	String name,
	String email,
	String phone,
	String userType,
	String profilePhotoUrl
) {
	/**
	 * User 엔티티 객체를 UserResponse로 변환
	 *
	 * @param user User 엔티티
	 * @return UserResponse 객체
	 */
	public static UserResponse from(User user) {
		return new UserResponse(
			user.getUserId(),
			user.getName(),
			user.getEmail(),
			user.getPhone(),
			user.getUserType(),
			user.getProfilePhotoUrl()
		);
	}
}
