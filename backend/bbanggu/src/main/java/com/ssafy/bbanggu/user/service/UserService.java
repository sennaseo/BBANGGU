package com.ssafy.bbanggu.user.service;

import java.util.HashMap;
import java.util.Map;

<<<<<<< HEAD
=======
import com.ssafy.bbanggu.common.exception.DuplicateEmailException;
>>>>>>> origin/develop
import com.ssafy.bbanggu.common.util.JwtUtil;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.dto.CreateUserRequest;
import com.ssafy.bbanggu.user.dto.UpdateUserRequest;
import com.ssafy.bbanggu.user.dto.UserResponse;
import com.ssafy.bbanggu.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

@Service
public class UserService { // 사용자 관련 비즈니스 로직 처리
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${jwt.secret}")
    private String secretKey;

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
<<<<<<< HEAD
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        // 비밀번호를 암호화한 후 저장
        String encodedPassword = passwordEncoder.encode(request.password());

        // 변경된 User 엔티티에 맞게 회원가입 진행
=======
		// 1. 이메일 중복 여부 검사
		validateEmailNotExists(request.email());

        // 2. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.password());

		// 3. User 엔티티 생성 및 저장 (회원가입)
>>>>>>> origin/develop
        User user = User.createNormalUser(request.name(), request.email(), encodedPassword, request.phoneNumber(), request.userType());
        userRepository.save(user);

        return UserResponse.from(user);
    }

<<<<<<< HEAD
=======
	private void validateEmailNotExists(String email) {
		if (userRepository.existsByEmail(email)) {
			throw new DuplicateEmailException(HttpStatus.CONFLICT, "Email already exists");
		}
	}

>>>>>>> origin/develop
    /**
     * 사용자 삭제 메서드
     * @param userId 삭제할 사용자 ID
     */
    public void delete(Long userId) {
        // 사용자 조회
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // 이미 삭제된 사용자 처리
        if (user.isDeleted()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is already deleted");
        }

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
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        // 논리적으로 삭제된 사용자 처리
        if (user.isDeleted()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This account has been deactivated. Please contact support.");
        }

        // 비밀번호 검증
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        // JWT 토큰 발급
        String accessToken = jwtUtil.generateAccessToken(email, user.getUserId());
        String refreshToken = jwtUtil.generateRefreshToken(email);

        // Refresh Token 저장
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        // 응답 데이터 생성
        Map<String, String> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("access_token", accessToken);
        response.put("refresh_token", refreshToken);

        return response;
    }

    /**
     * 로그아웃 처리 메서드
     *
     * @param refreshToken 클라이언트에서 전달받은 Refresh Token
     */
    public void logout(String refreshToken) {
        // Refresh Token으로 사용자 검색
        User user = userRepository.findByRefreshToken(refreshToken)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired refresh token"));

        // Refresh Token 삭제
        user.clearRefreshToken();
        userRepository.save(user);
    }

    /**
     * Access Token 재발급 메서드
     *
     * @param refreshToken 클라이언트에서 전달받은 Refresh Token
     * @return 새로운 Access Token
     */
    public String refreshAccessToken(String refreshToken) {
        try {
            // Refresh Token 검증
            Claims claims = jwtUtil.validateToken(refreshToken);

            // 새로운 Access Token 발급
            String email = claims.getSubject();
            Long userId = claims.get("userId", Long.class); // 클레임에서 userId 추출
            return jwtUtil.generateAccessToken(email, userId);

        } catch (JwtException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired refresh token");
        }
    }

    /**
     * 사용자 정보 수정
     *
     * @param userId 수정할 사용자 ID
     * @param request 수정 요청 데이터
     * @return UserResponse 수정된 사용자 정보
     */
    public UserResponse update(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.update(request.name(), request.profilePhotoUrl());
        userRepository.save(user);
        return UserResponse.from(user);
    }

    /**
     * 비밀번호 업데이트 메서드
     * @param email 사용자 이메일
     * @param newPassword 새로운 비밀번호
     */
    public void updatePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // 비밀번호 암호화 후 저장
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
