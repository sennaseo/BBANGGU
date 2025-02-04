package com.ssafy.bbanggu.user.service;

import java.util.HashMap;
import java.util.Map;

import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.auth.security.JwtUtil;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.dto.CreateUserRequest;
import com.ssafy.bbanggu.user.dto.UpdateUserRequest;
import com.ssafy.bbanggu.user.dto.UserResponse;
import com.ssafy.bbanggu.user.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService { // 사용자 관련 비즈니스 로직 처리
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * 회원가입 로직 처리
     *
     * @param request 회원가입 요청 데이터
     * @return UserResponse 생성된 사용자 정보
     */
    public UserResponse create(CreateUserRequest request) {
		// 1. 이메일 중복 여부 검사
		validateEmailNotExists(request.email());

        // 2. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.password());

		// 3. User 엔티티 생성 및 저장 (회원가입)
        User user = User.createNormalUser(request.name(), request.email(), encodedPassword, request.phoneNumber(), request.userType());
        userRepository.save(user);

        return UserResponse.from(user);
    }

	private void validateEmailNotExists(String email) {
		if (userRepository.existsByEmail(email)) {
			throw new CustomException(ErrorCode.EMAIL_ALREADY_IN_USE);
		}
	}

    /**
     * 사용자 삭제 메서드
     * @param userId 삭제할 사용자 ID
     */
    public void delete(Long userId) {
        // 사용자 조회
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 이미 삭제된 사용자 처리
        if (user.isDeleted()) {
            throw new CustomException(ErrorCode.ACCOUNT_DEACTIVATED);
        }

		// Refresh Token 삭제
		user.setRefreshToken(null);

        // 논리적 삭제 처리
        user.delete();
        userRepository.save(user);
    }

    /**
     * 로그인 처리 메서드
     *
     * @param email 사용자 이메일
     * @param password 사용자 비밀번호
     * @return UserResponse 로그인 성공 시 사용자 정보
     */
    public Map<String, String> login(String email, String password) {
        // 이메일로 사용자 조회
        User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 논리적으로 삭제된 사용자 처리
        if (user.isDeleted()) {
			throw new CustomException(ErrorCode.ACCOUNT_DEACTIVATED);
        }

        // 비밀번호 검증
        if (!passwordEncoder.matches(password, user.getPassword())) {
			throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        // ✅ JWT 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(email, user.getUserId());
        String refreshToken = jwtUtil.generateRefreshToken(email);

        // ✅ Refresh Token을 DB 저장
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        // ✅ 응답 데이터 생성
        Map<String, String> tokens = new HashMap<>();
		tokens.put("access_token", accessToken);
		tokens.put("refresh_token", refreshToken);

        return tokens;
    }

    /**
     * 로그아웃: RefreshToken 삭제
     */
    public void logout(Long userId) {
		// 사용자의 Refresh Token 삭제
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// ✅ Refresh Token 삭제하여 재로그인 방지
		user.setRefreshToken(null);
		userRepository.save(user);
    }

    /**
     * 사용자 정보 수정
     */
    public void update(Long userId, Map<String, Object> updates) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// ✅ 이미 탈퇴한 사용자 처리
		if (user.isDeleted()) {
			throw new CustomException(ErrorCode.ACCOUNT_DEACTIVATED);
		}

		// ✅ 특정 필드만 변경 가능하도록 처리
		updates.forEach((key, value) -> {
			switch (key) {
				case "name" -> user.setName((String) value);
				case "phoneNumber" -> {
					if (userRepository.existsByPhoneNumber((String) value)) {
						throw new CustomException(ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
					}
					user.setPhoneNumber((String) value);
				}
				case "profileImage" -> user.setProfilePhotoUrl((String) value);
				default -> throw new CustomException(ErrorCode.INVALID_REQUEST);
			}
		});

		userRepository.save(user);
    }

    /**
     * 비밀번호 업데이트 메서드
     * @param email 사용자 이메일
     * @param newPassword 새로운 비밀번호
     */
    public void updatePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// 새로운 비밀번호가 기존 비밀번호와 동일한지 검증
		if (passwordEncoder.matches(newPassword, user.getPassword())) {
			throw new CustomException(ErrorCode.SAME_AS_OLD_PASSWORD);
		}

        // 비밀번호 암호화 후 저장
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

	public Long getUserIdByEmail(String email) {
		return userRepository.findByEmail(email)
			.map(User::getUserId)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
	}
}
