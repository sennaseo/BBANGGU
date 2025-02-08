package com.ssafy.bbanggu.user.repository;

import com.ssafy.bbanggu.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * UserRepository 인터페이스
 * JPA를 이용해 데이터베이스와 상호작용
 */
public interface UserRepository extends JpaRepository<User, Long> {

	/**
	 * 이메일 존재 여부 확인
	 *
	 * @param email 사용자 이메일
	 * @return 이메일 존재 여부
	 */
	boolean existsByEmail(String email);

	/**
	 * 이메일과 비밀번호로 사용자 조회
	 *
	 * @param email 사용자 이메일
	 * @param password 사용자 비밀번호
	 * @return User 엔티티
	 */
	Optional<User> findByEmailAndPassword(String email, String password);

	/**
	 * 이메일로 사용자 조회
	 *
	 * @param email 사용자 이메일
	 * @return User 엔티티
	 */
	Optional<User> findByEmail(String email);

	/**
	 * Refresh Token으로 사용자 조회
	 *
	 * @param refreshToken
	 * @return
	 */
	Optional<User> findByRefreshToken(String refreshToken);

	Optional<User> findByKakaoId(String kakaoId);

	boolean existsByPhone(String value);
}
