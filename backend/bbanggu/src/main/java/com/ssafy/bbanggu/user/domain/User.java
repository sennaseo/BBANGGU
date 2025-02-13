package com.ssafy.bbanggu.user.domain;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import com.ssafy.bbanggu.user.Role;

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
	@Column(name = "kakao_id", unique = true, length = 50)
	private String kakaoId;

	@Column(nullable = false)
	@Setter
	private String name;

	@Column(nullable = false, unique = true)
	private String email;

	@Setter
	@NotNull
	@Column(nullable = false)
	private String password;

	@Column
	@Setter
	private String phone;

	@Enumerated(EnumType.STRING)
	@Column(name = "user_type", nullable = false)
	private Role role;

	@Column(name = "profile_image_url")
	@Setter
	private String profileImageUrl;

	@Setter
	@Column(name = "refresh_token", length = 512)
	private String refreshToken;

	@Setter
	@Column(name = "address_road")
	private String addressRoad;

	@Setter
	@Column(name = "address_detail")
	private String addressDetail;

	@Setter
	@Column
	private Double latitude = 0.0;

	@Setter
	@Column
	private Double longitude = 0.0;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createAt;

	@Column(name = "deleted_at")
	private LocalDateTime deletedAt;

	/**
	 * User 생성자 - 필수 필드 초기화
	 *
	 * @param name 사용자 이름
	 * @param email 사용자 이메일
	 * @param password 사용자 비밀번호
	 * @param phone 사용자 전화번호
	 * @param role 사용자 유형
	 */
	public User(String name, String email, String kakaoId, String password, String phone, Role role) {
		this.name = name;
		this.email = email;
		this.kakaoId = kakaoId;
		this.password = password;
		this.phone = phone;
		this.role = role;
	}

	/**
	 * 일반 회원가입을 위한 생성자
	 *
	 * @param name 사용자 이름
	 * @param email 사용자 이메일
	 * @param password 암호화된 비밀번호
	 * @param phone 사용자 전화번호
	 * @param role 사용자 유형
	 * @return User 객체
	 */
	public static User createNormalUser(String name, String email, String password, String phone, Role role) {
		return new User(name, email, null, password, phone, role);
	}

	/**
	 * 카카오 로그인을 위한 생성자
	 *
	 * @param kakaoId 카카오 계정 ID
	 * @param nickname 사용자 닉네임
	 * @return User 객체
	 */
	public static User createKakaoUser(String kakaoId, String nickname) {
		return new User(nickname, "kakao_" + kakaoId + "@bbanggu.com", kakaoId, UUID.randomUUID().toString(), null, Role.USER);
	}

	/**
	 * 기본 정보 수정 메서드
	 *
	 * @param name 이름
	 * @param phone 전화번호
	 * @param profileImageUrl 프로필 이미지
	 */
	public void updateUserInfo(String name, String phone, String profileImageUrl) {
		if (name != null && !name.isBlank()) this.name = name;
		if (phone != null && phone.matches("^(010-\\d{4}-\\d{4})$")) this.phone = phone;
		if (profileImageUrl != null && !profileImageUrl.isBlank()) this.profileImageUrl = profileImageUrl;
	}

	/**
	 * 위치 정보 수정 메서드
	 *
	 * @param addressRoad 도로명 주소
	 * @param addressDetail 상세 주소
	 * @param latitude 위도
	 * @param longitude 경도
	 */
	public void updateUserPos(String addressRoad, String addressDetail, Double latitude, Double longitude) {
		if (addressRoad != null && !addressRoad.isBlank()) this.addressRoad = addressRoad;
		if (addressDetail != null && !addressDetail.isBlank()) this.addressDetail = addressDetail;
		if (latitude != null) this.latitude = latitude;
		if (longitude != null) this.longitude = longitude;
	}

	// 역할 변경 메서드
	public void changeRole(Role newRole) {
		this.role = newRole;
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
