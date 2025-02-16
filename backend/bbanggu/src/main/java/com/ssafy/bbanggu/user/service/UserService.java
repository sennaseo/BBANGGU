package com.ssafy.bbanggu.user.service;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.bbanggu.auth.dto.JwtToken;
import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.auth.security.JwtTokenProvider;
import com.ssafy.bbanggu.bakery.domain.Bakery;
import com.ssafy.bbanggu.bakery.dto.BakeryDto;
import com.ssafy.bbanggu.bakery.repository.BakeryRepository;
import com.ssafy.bbanggu.bakery.service.BakeryService;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.saving.domain.EchoSaving;
import com.ssafy.bbanggu.saving.repository.EchoSavingRepository;
import com.ssafy.bbanggu.user.Role;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.dto.CreateUserRequest;
import com.ssafy.bbanggu.user.dto.PasswordUpdateRequest;
import com.ssafy.bbanggu.user.dto.UpdateUserRequest;
import com.ssafy.bbanggu.user.dto.UserResponse;
import com.ssafy.bbanggu.user.repository.UserRepository;
import com.ssafy.bbanggu.util.image.ImageService;

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
	private final BakeryRepository bakeryRepository;
	private final ImageService imageService;

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
		return UserResponse.from(user, null);
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

        // // 비밀번호 검증
        // if (!passwordEncoder.matches(password, user.getPassword())) {
        //  throw new CustomException(ErrorCode.INVALID_PASSWORD);
        // }

		// 단순 문자열 비교로 변경
		if (!password.equals(user.getPassword())) {
			throw new CustomException(ErrorCode.INVALID_PASSWORD);
		}


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

		Long bakeryId = null;
		if (user.getRole().equals(Role.OWNER)) {
			bakeryId = bakeryRepository.findByUser_UserId(user.getUserId()).getBakeryId();
		}

		return UserResponse.from(user, bakeryId);
	}

	/**
	 * 사용자 정보 수정
	 */
	@Transactional
	public void update(CustomUserDetails userDetails, UpdateUserRequest updates, MultipartFile profileImg) {
		User user = userRepository.findById(userDetails.getUserId())
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// ✅ 이미 탈퇴한 사용자 처리
		if (user.isDeleted()) {
			throw new CustomException(ErrorCode.ACCOUNT_DEACTIVATED);
		}
		log.info("✅ {}번 사용자 검증 완료", userDetails.getUserId());

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

		if (profileImg != null && !profileImg.isEmpty()) {
			try {
				String profileImageUrl = imageService.saveImage(profileImg); // 새 이미지 저장
				if (profileImageUrl != null) {
					user.setProfileImageUrl(profileImageUrl);
				}
			} catch (IOException e) {
				throw new CustomException(ErrorCode.PROFILE_IMAGE_UPLOAD_FAILED);
			}
		}

		// ✅ 특정 필드만 변경 가능하도록 처리
		user.setName(Optional.ofNullable(updates.name()).orElse(user.getName()));
		user.setPhone(Optional.ofNullable(updates.phone()).orElse(user.getPhone()));

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

	/**
	 * 이메일이 DB에 존재하는지 확인
	 */
	public boolean existsByEmail(String email) {
		return userRepository.existsByEmail(email);
	}

	public BakeryDto getOwnerBakery(CustomUserDetails userDetails) {
		User user = userRepository.findById(userDetails.getUserId())
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		if (user.getRole().equals(Role.USER)) {
			throw new CustomException(ErrorCode.USER_IS_NOT_OWNER);
		}
		log.info("✅ 현재 로그인한 {}번 사용자가 사장님임이 검증됨", userDetails.getUserId());

		Bakery bakery = bakeryRepository.findByUser_UserId(user.getUserId());

		return new BakeryDto(
			bakery.getBakeryId(),
			bakery.getUser().getUserId(),
			bakery.getName(),
			bakery.getDescription(),
			bakery.getBusinessRegistrationNumber(),
			bakery.getAddressRoad(),
			bakery.getAddressDetail(),
			bakery.getBakeryImageUrl(),
			bakery.getBakeryBackgroundImgUrl(),
			bakery.getStar(),
			bakery.getReviewCnt()
		);
	}

	/**
	 * 비밀번호 변경 (마이페이지)
	 */
	public void updatePwd(CustomUserDetails userDetails, PasswordUpdateRequest request) {
		User user = userRepository.findById(userDetails.getUserId())
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		// 비밀번호 검증
		// if (!passwordEncoder.matches(password, user.getPassword())) {
		// 	throw new CustomException(ErrorCode.INVALID_PASSWORD);
		// }

		if (!request.originPassword().equals(user.getPassword())) {
			throw new CustomException(ErrorCode.NOT_EQUAL_PASSWORD);
		}

		if(user.getPassword().equals(request.newPassword())) {
			throw new CustomException(ErrorCode.EQUAL_ORIGIN_AND_NEW_PASSWORD);
		}

		user.setPassword(request.newPassword());
		userRepository.save(user);
	}
}
