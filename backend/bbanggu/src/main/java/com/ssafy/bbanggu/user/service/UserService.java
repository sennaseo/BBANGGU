package com.ssafy.bbanggu.user.service;

import java.util.Map;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.bbanggu.auth.dto.JwtToken;
import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.auth.security.JwtTokenProvider;
import com.ssafy.bbanggu.bakery.service.BakeryService;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.saving.domain.EchoSaving;
import com.ssafy.bbanggu.saving.repository.EchoSavingRepository;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.dto.CreateUserRequest;
import com.ssafy.bbanggu.user.dto.UpdateUserRequest;
import com.ssafy.bbanggu.user.dto.UserResponse;
import com.ssafy.bbanggu.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService { // 사용자 관련 비즈니스 로직 처리

	private final UserRepository userRepository;
	private final EchoSavingRepository echoSavingRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider jwtTokenProvider;
	private final BakeryService bakeryService;

	/**
	 * 회원가입 로직 처리
	 *
	 * @param request 회원가입 요청 데이터
	 * @return UserResponse 생성된 사용자 정보
	 */
	public UserResponse create(CreateUserRequest request) {
		// ✅ 이메일 중복 여부 검사
		if (userRepository.existsByEmail(request.email())) {
			throw new CustomException(ErrorCode.EMAIL_ALREADY_IN_USE);
		}

		// ✅ 전화번호 중복 확인
		if (userRepository.existsByPhone(request.phone())) {
			throw new CustomException(ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
		}

		// 1️⃣ 비밀번호 암호화
		//String encodedPassword = passwordEncoder.encode(request.password());

		// 2️⃣ User 엔티티 생성 및 저장 (회원가입)
		// User user = User.createNormalUser(request.name(), request.email(), encodedPassword, request.phone(), request.toEntity().getRole());
		User user = User.createNormalUser(request.name(), request.email(), request.password(), request.phone(), request.toEntity().getRole());
		userRepository.save(user);

		// 3️⃣ 절약 정보 자동 생성 및 초기화
		EchoSaving echoSaving = EchoSaving.builder()
			.user(user)
			.savedMoney(0)
			.reducedCo2e(0)
			.build();

		echoSavingRepository.save(echoSaving);
		return UserResponse.from(user);
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
	public JwtToken login(String email, String password) {
		// 이메일로 사용자 조회
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// 논리적으로 삭제된 사용자 처리
		if (user.isDeleted()) {
			throw new CustomException(ErrorCode.ACCOUNT_DEACTIVATED);
        }

		// 비밀번호 검증
		// if (!passwordEncoder.matches(password, user.getPassword())) {
		// 	throw new CustomException(ErrorCode.INVALID_PASSWORD);
        // }

        // ✅ JWT 토큰 생성
		String accessToken = jwtTokenProvider.createAccessToken(user.getUserId());
		String refreshToken = jwtTokenProvider.createRefreshToken(user.getUserId());

        // ✅ Refresh Token을 DB 저장
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        // ✅ 응답 데이터 생성
		JwtToken tokens = new JwtToken(accessToken, refreshToken);
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
	 * 사용자 정보 조회
	 */
	public UserResponse getUserInfo(CustomUserDetails userDetails) {
		User user = userRepository.findById(userDetails.getUserId())
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// 탈퇴한 계정인지 확인
		if (user.getDeletedAt() != null) {
			throw new CustomException(ErrorCode.ACCOUNT_DEACTIVATED);
		}
		log.info("✅ {}번 사용자 검증 완료", userDetails.getUserId());

		return UserResponse.from(user);
	}

	/**
	 * 사용자 정보 수정
	 */
	@Transactional
	public void update(Long userId, UpdateUserRequest updates) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// ✅ 이미 탈퇴한 사용자 처리
		if (user.isDeleted()) {
			throw new CustomException(ErrorCode.ACCOUNT_DEACTIVATED);
		}

		// ✅ 위치 정보가 바뀌었을 때에만 변경 가능하도록 처리
		String addrRoad = user.getAddressRoad();
		String addrDetail = user.getAddressDetail();

		if ((updates.addressRoad() != null && !updates.addressRoad().equals(addrRoad))
			|| (updates.addressDetail() != null && !updates.addressDetail().equals(addrDetail))) {
			double[] latLng = bakeryService.getLatitudeLongitude(updates.addressRoad(), updates.addressDetail());
			user.updateUserPos(
				updates.addressRoad(),
				updates.addressDetail(),
				latLng[0],
				latLng[1]
			);
		}

		// ✅ 특정 필드만 변경 가능하도록 처리
		user.updateUserInfo(
			updates.name(),
			updates.phone(),
			updates.profileImageUrl()
		);
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

	/**
	 * 이메일이 DB에 존재하는지 확인
	 */
	public boolean existsByEmail(String email) {
		return userRepository.existsByEmail(email);
	}
}
