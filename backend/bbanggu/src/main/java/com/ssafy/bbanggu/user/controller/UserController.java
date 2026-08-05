package com.ssafy.bbanggu.user.controller;

import java.util.HashMap;
import java.util.Map;

import com.ssafy.bbanggu.auth.dto.EmailRequest;
import com.ssafy.bbanggu.auth.dto.JwtToken;
import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.auth.service.EmailService;
import com.ssafy.bbanggu.bakery.dto.BakeryDto;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.dto.CreateUserRequest;
import com.ssafy.bbanggu.user.dto.LoginRequest;
import com.ssafy.bbanggu.user.dto.PasswordResetConfirmRequest;
import com.ssafy.bbanggu.user.dto.PasswordUpdateRequest;
import com.ssafy.bbanggu.user.dto.UpdateUserRequest;
import com.ssafy.bbanggu.user.dto.UserResponse;
import com.ssafy.bbanggu.user.repository.UserRepository;
import com.ssafy.bbanggu.user.service.UserService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
	private final com.ssafy.bbanggu.auth.security.AuthCookieFactory cookieFactory;


	/**
	 * 회원가입 API
	 *
	 * @param request 회원가입 요청 정보 (name, email, password, phone, userType)
	 * @param result 유효성 검사 결과
	 * @return 생성된 사용자 정보 반환
	 */
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
		return ResponseEntity.status(HttpStatus.NO_CONTENT)
			.header(HttpHeaders.SET_COOKIE, cookieFactory.expiredAccessToken().toString())
			.header(HttpHeaders.SET_COOKIE, cookieFactory.expiredRefreshToken().toString())
			.body(new ApiResponse("회원탈퇴가 성공적으로 완료되었습니다.", null));
	}

    // ✅ 로그인
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request, BindingResult result) {
		log.info("🩵 로그인 컨트롤러 들어옴");
		if (result.hasErrors()) {
			throw new CustomException(ErrorCode.BAD_REQUEST);
		}

		// ✅ UserService에서 로그인 & 토큰 생성
		Map<String, Object> loginInfo = userService.login(request.getEmail(), request.getPassword());
		Object accessToken = loginInfo.get("access_token");
		Object refreshToken = loginInfo.get("refresh_token");

		// ✅ 토큰 쿠키 저장 (쿠키명·secure·path 규칙을 팩토리로 통일 — 기존엔 access_token/refresh_token
		//    언더스코어 이름이라 refresh 엔드포인트가 읽는 카멜케이스(refreshToken) 쿠키와 안 맞았음)
		ResponseCookie accessTokenCookie = cookieFactory.accessToken((String)accessToken);
		ResponseCookie refreshTokenCookie = cookieFactory.refreshToken((String)refreshToken);

		// 토큰은 httpOnly 쿠키로만 내려간다 — body에 남기면 XSS가 훔칠 수 있어 user_type만 남긴다
		loginInfo.remove("refresh_token");
		loginInfo.remove("access_token");

		return ResponseEntity.ok()
			.header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
			.header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
			.body(new ApiResponse("로그인이 성공적으로 완료되었습니다.", loginInfo));
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
		return ResponseEntity.ok()
			.header(HttpHeaders.SET_COOKIE, cookieFactory.expiredAccessToken().toString())
			.header(HttpHeaders.SET_COOKIE, cookieFactory.expiredRefreshToken().toString())
			.body(new ApiResponse("로그아웃이 완료되었습니다.", null));
    }

	/**
	 * 회원 정보 조회
	 *
	 * @param userDetails 현재 로그인한 사용자 정보
	 * @return 현재 로그인한 사용자의 상세 정보
	 */
	@GetMapping
	public ResponseEntity<ApiResponse> getUserInfo(
		@AuthenticationPrincipal CustomUserDetails userDetails
	) {
		log.info("✨ 사용자 정보 조회 ✨");
		UserResponse user = userService.getUserInfo(userDetails);
		return ResponseEntity.ok(new ApiResponse("회원 정보 조회가 성공적으로 완료되었습니다.", user));
	}

    /**
     * 회원 정보 수정 API
     */
    @PatchMapping("/update")
    public ResponseEntity<ApiResponse> updateUser(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@RequestPart(value = "user", required = false) UpdateUserRequest updates,
		@RequestPart(value = "profileImage", required = false) MultipartFile file
	) {
		log.info("🩵 회원정보 수정 정보: " + updates.toString());
		// ✅ 변경할 필드만 업데이트
		userService.update(userDetails, updates, file);
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


	/**
	 * 사장님 가게 정보 조회 API
	 *
	 * @param userDetails 현재 로그인한 사용자 정보
	 * @return 사장님 빵집 정보
	 */
	@GetMapping("/bakery")
	public ResponseEntity<ApiResponse> getOwnerBakery(@AuthenticationPrincipal CustomUserDetails userDetails) {
		log.info("✨ 사장님 가게 정보 조회 ✨");
		BakeryDto bakery = userService.getOwnerBakery(userDetails);
		log.info("🩵 사장님 가게 정보 조회 성공 🩵");
		return ResponseEntity.ok(new ApiResponse("사장님의 아이디로 가게 정보를 조회하였습니다.", bakery));
	}

	/**
	 * 비밀번호 변경 (마이페이지) API
	 *
	 * @param userDetails 현재 로그인한 사용자 정보
	 * @param request originPwd, newPwd
	 * @return pass or fail
	 */
	@PostMapping("/update/password")
	public ResponseEntity<ApiResponse> updatePassword(
		@AuthenticationPrincipal CustomUserDetails userDetails,
		@RequestBody PasswordUpdateRequest request
	) {
		log.info("✨ 비밀번호 변경 (마이페이지) ✨");
		userService.updatePwd(userDetails, request);
		log.info("🩵 비밀번호 변경 (마이페이지) 성공 🩵");
		return ResponseEntity.ok(new ApiResponse("비밀번호 변경이 완료되었습니다.", null));
	}
}
