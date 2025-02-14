package com.ssafy.bbanggu.user.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.ssafy.bbanggu.auth.dto.EmailRequest;
import com.ssafy.bbanggu.auth.dto.JwtToken;
import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.auth.service.EmailService;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.dto.CreateUserRequest;
import com.ssafy.bbanggu.user.dto.LoginRequest;
import com.ssafy.bbanggu.user.dto.PasswordResetConfirmRequest;
import com.ssafy.bbanggu.user.dto.UpdateUserRequest;
import com.ssafy.bbanggu.user.dto.UserResponse;
import com.ssafy.bbanggu.user.repository.UserRepository;
import com.ssafy.bbanggu.user.service.UserService;

import org.springframework.boot.autoconfigure.jms.artemis.ArtemisNoOpBindingRegistry;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final EmailService emailAuthService;
	private final UserRepository userRepository;

    // ✅ 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request, BindingResult result) {
        // 회원가입 요청 데이터 검증
        if (result.hasErrors()) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }

        UserResponse response = userService.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("회원가입이 완료되었습니다.", response));
    }

    /**
     * 회원탈퇴 API (논리적 삭제)
     */
    @DeleteMapping()
    public ResponseEntity<?> deleteUser(Authentication authentication) {
		// ✅ userId 가져오기
		Long userId = Long.parseLong(authentication.getName());

		// ✅ 회원 탈퇴 처리 (논리 삭제)
		userService.delete(userId);

		// ✅ AccessToken & RefreshToken 쿠키 즉시 만료시키기
		ResponseCookie expiredAccessToken = ResponseCookie.from("accessToken", "")
			.httpOnly(true)
			.secure(true)
			.path("/")
			.maxAge(0) // 즉시 만료
			.build();

		ResponseCookie expiredRefreshToken = ResponseCookie.from("refreshToken", "")
			.httpOnly(true)
			.secure(true)
			.path("/")
			.maxAge(0) // 즉시 만료
			.build();

		return ResponseEntity.status(HttpStatus.NO_CONTENT)
			.header(HttpHeaders.SET_COOKIE, expiredAccessToken.toString())
			.header(HttpHeaders.SET_COOKIE, expiredRefreshToken.toString())
			.body(new ApiResponse("회원탈퇴가 성공적으로 완료되었습니다.", null));
	}

    // ✅ 로그인
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request, BindingResult result) {
		if (result.hasErrors()) {
			throw new CustomException(ErrorCode.BAD_REQUEST);
		}

		// ✅ UserService에서 로그인 & 토큰 생성
		JwtToken tokens = userService.login(request.getEmail(), request.getPassword());
		String accessToken = tokens.getAccessToken();
		String refreshToken = tokens.getRefreshToken();

		// ✅ AccessToken을 HTTP-Only 쿠키에 저장
		ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", accessToken)
			.httpOnly(false) // XSS 공격 방지
			.secure(true) // HTTPS 환경에서만 사용 (로컬 개발 시 false 가능)
			.path("/") // 모든 API 요청에서 쿠키 전송 가능
			.maxAge(30 * 60) // 30분 유지
			.build();

		// ✅ RefreshToken을 HTTP-Only 쿠키에 저장
		ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
			.httpOnly(true)
			.secure(true)
			.path("/")
			.maxAge(7 * 24 * 60 * 60)
			.build();

		User user = userRepository.findByEmail(request.getEmail())
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		Map<String, Object> response = new HashMap<>();
		response.put("access_token", accessToken);
		response.put("refresh_token", refreshToken);
		response.put("user_type", user.getRole());

		return ResponseEntity.ok()
			.header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
			.header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
			.body(new ApiResponse("로그인이 성공적으로 완료되었습니다.", response));
    }

    /**
     * 로그아웃 API
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(Authentication authentication) {
		// ✅ userId 가져오기
		Long userId = Long.parseLong(authentication.getName());

		// ✅ 로그아웃 처리 (Refresh Token 삭제)
		userService.logout(userId);

		// ✅ AccessToken & RefreshToken 쿠키 즉시 만료시키기
		ResponseCookie expiredAccessToken = ResponseCookie.from("accessToken", "")
			.httpOnly(true)
			.secure(true)
			.path("/")
			.maxAge(0) // 즉시 만료
			.build();

		ResponseCookie expiredRefreshToken = ResponseCookie.from("refreshToken", "")
			.httpOnly(true)
			.secure(true)
			.path("/")
			.maxAge(0) // 즉시 만료
			.build();

		return ResponseEntity.ok()
			.header(HttpHeaders.SET_COOKIE, expiredAccessToken.toString())
			.header(HttpHeaders.SET_COOKIE, expiredRefreshToken.toString())
			.body(new ApiResponse("로그아웃이 완료되었습니다.", null));
    }

	@GetMapping("/{userId}")
	public ResponseEntity<ApiResponse> getUserInfo(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@PathVariable Long userId
	) {
		// 현재 로그인한 사용자와 조회 대상이 일치하는지 확인
		if (!userDetails.getUserId().equals(userId)) {
			throw new CustomException(ErrorCode.NOT_EQUAL_USER);
		}

		UserResponse user = userService.getUserInfo(userId);
		return ResponseEntity.ok(new ApiResponse("회원 정보 조회가 성공적으로 완료되었습니다.", user));
	}

    /**
     * 회원 정보 수정 API
     */
    @PatchMapping("/update")
    public ResponseEntity<ApiResponse> updateUser(Authentication authentication,
		@RequestBody UpdateUserRequest updates) {
		// ✅ userId 조회
		Long userId = Long.parseLong(authentication.getName());

		// ✅ 변경할 필드만 업데이트
		userService.update(userId, updates);

		return ResponseEntity.ok(new ApiResponse("회원 정보가 성공적으로 수정되었습니다.", null));
    }

    /**
     * 비밀번호 초기화 요청 API
     */
    @PostMapping("/password/reset")
    public ResponseEntity<ApiResponse> resetPasswordRequest(@Valid @RequestBody EmailRequest request) {
		if (!userService.existsByEmail(request.getEmail())) {
			throw new CustomException(ErrorCode.EMAIL_NOT_FOUND);
		}

		try {
			emailAuthService.sendAuthenticationCode(request.getEmail());
			return ResponseEntity.ok(new ApiResponse("비밀번호 재설정 요청이 처리되었습니다. 이메일을 확인해주세요.", null));
		} catch (CustomException e) {
			return ResponseEntity.status(e.getStatus())
				.body(new ApiResponse(e.getMessage(), null));
		}
    }

    /**
     * 비밀번호 초기화 및 변경 API
     * @return 처리 결과 메시지
     */
    @PostMapping("/password/reset/confirm")
	public ResponseEntity<ApiResponse> resetPasswordConfirm(@Valid @RequestBody PasswordResetConfirmRequest request) {
		if (request.getNewPassword().length() < 8) {
			throw new CustomException(ErrorCode.INVALIE_PASSWORD);
		}

		userService.updatePassword(request.getEmail(), request.getNewPassword()); // 비밀번호 업데이트
		return ResponseEntity.ok(new ApiResponse("비밀번호가 성공적으로 변경되었습니다.", null));
	}
}
