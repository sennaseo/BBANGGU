package com.ssafy.bbanggu.user.domain;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * User 엔티티
 * 데이터베이스의 'user' 테이블과 매핑되며, 사용자 정보를 관리
 */
@Data
@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id", columnDefinition = "INT UNSIGNED")
	@Getter
	private Long userId; // 사용자 고유 ID (Primary Key)

	@Setter
	@Column(unique = true, length = 50)
	private String kakaoId;

	@NotNull
	@Column(nullable = false)
	@Setter
	private String name;

	@NotNull
	@Column(nullable = false, unique = true)
	private String email;

	@Setter
	@NotNull
	@Column(nullable = false)
	private String password;

	@Column
	@Setter
	private String phoneNumber;

	@NotNull
	@Column(nullable = false)
	private String userType;

	@Column
	@Setter
	private String profilePhotoUrl;

	@Setter
	@Column(length = 512)
	private String refreshToken;

	@CreationTimestamp
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createAt;

	@Column(name = "deleted_at")
	private LocalDateTime deletedAt;

	/**
	 * User 생성자 - 필수 필드 초기화
	 *
	 * @param name 사용자 이름
	 * @param email 사용자 이메일
	 * @param password 사용자 비밀번호
	 * @param phoneNumber 사용자 전화번호
	 * @param userType 사용자 유형
	 */
	public User(String name, String email, String kakaoId, String password, String phoneNumber, String userType) {
		this.name = name;
		this.email = email;
		this.kakaoId = kakaoId;
		this.password = password;
		this.phoneNumber = phoneNumber;
		this.userType = userType;
	}

	/**
	 * 일반 회원가입을 위한 생성자
	 *
	 * @param name 사용자 이름
	 * @param email 사용자 이메일
	 * @param password 암호화된 비밀번호
	 * @param phoneNumber 사용자 전화번호
	 * @param userType 사용자 유형
	 * @return User 객체
	 */
	public static User createNormalUser(String name, String email, String password, String phoneNumber, String userType) {
		return new User(name, email, null, password, phoneNumber, userType);
	}

	/**
	 * 카카오 로그인을 위한 생성자
	 *
	 * @param kakaoId 카카오 계정 ID
	 * @param nickname 사용자 닉네임
	 * @return User 객체
	 */
	public static User createKakaoUser(String kakaoId, String nickname) {
		return new User(nickname, "kakao_" + kakaoId + "@bbanggu.com", kakaoId, UUID.randomUUID().toString(), null, "USER");
	}

	/**
	 * 사용자 정보 수정 메서드
	 *
	 * @param name 변경할 사용자 이름
	 * @param profilePhotoUrl 변경할 프로필 사진 URL
	 */
	public void update(String name, String profilePhotoUrl) {
		if (name != null) {
			this.name = name;
		}
		if (profilePhotoUrl != null) {
			this.profilePhotoUrl = profilePhotoUrl;
		}
	}

	/**
	 * Refresh Token 업데이트
	 * @param refreshToken
	 */
	public void updateRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}

	/**
	 * Refresh Token 삭제 메서드
	 */
	public void clearRefreshToken() {
		this.refreshToken = null;
	}

	/**
	 * 논리적 삭제 메서드
	 */
	public void delete() {
		this.deletedAt = LocalDateTime.now(); // 삭제 시간 설정
		this.refreshToken = null; // refresh token 삭제
	}

	/**
	 * 논리적 삭제 여부 확인
	 * @return 삭제 여부 (true = 삭제됨)
	 */
	public boolean isDeleted() {
		return this.deletedAt != null;
	}
}
