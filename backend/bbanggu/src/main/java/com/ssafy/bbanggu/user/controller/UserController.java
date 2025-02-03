package com.ssafy.bbanggu.user.controller;

import static org.springframework.http.ResponseCookie.*;

import java.util.HashMap;
import java.util.Map;

import com.ssafy.bbanggu.auth.service.EmailService;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.common.response.ApiResponse;
import com.ssafy.bbanggu.user.dto.CreateUserRequest;
import com.ssafy.bbanggu.user.dto.LoginRequest;
import com.ssafy.bbanggu.user.dto.UpdateUserRequest;
import com.ssafy.bbanggu.user.dto.UserResponse;
import com.ssafy.bbanggu.user.service.UserService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final EmailService emailAuthService;

    public UserController(UserService userService, EmailService emailAuthService) {
        this.userService = userService;
        this.emailAuthService = emailAuthService;
    }

    /**
     * 회원가입 API
     *
     * @param request 사용자 생성 요청 데이터 (name, email, password, phone_number, user_type)
     * @return 생성된 사용자 정보
     */
    @PostMapping("/register")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request, BindingResult result) {
        // 회원가입 요청 데이터 검증
        if (result.hasErrors()) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }

        UserResponse response = userService.create(request);

		Map<String, Object> responseData = new HashMap<>();
		responseData.put("message", "회원가입이 완료되었습니다.");
		responseData.put("data", response);

		return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse(201, "CREATED", responseData));
    }

    /**
     * 회원탈퇴 API (논리적 삭제)
     * @param userId 삭제할 사용자 ID
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        userService.delete(userId);
		return ResponseEntity.ok(new ApiResponse(200, "OK", "회원탈퇴가 완료되었습니다."));
    }

    /**
     * 로그인 API
     * @return 로그인 성공 시 사용자 정보
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request, BindingResult result) {
		if (result.hasErrors()) {
			throw new CustomException(ErrorCode.INVALID_REQUEST);
		}

		// ✅ UserService에서 로그인 & 토큰 생성
		Map<String, String> tokens = userService.login(request.getEmail(), request.getPassword());
		String accessToken = tokens.get("access_token");
		String refreshToken = tokens.get("refresh_token");

		// ✅ AccessToken을 HTTP-Only 쿠키에 저장
		ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", accessToken)
			.httpOnly(true) // XSS 공격 방지
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

		return ResponseEntity.ok()
			.header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
			.header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
			.body(new ApiResponse(200, "OK", "로그인이 성공적으로 완료되었습니다."));
    }

    /**
     * 로그아웃 API
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken != null) {
			userService.logout(refreshToken);
		}

		// ✅ AccessToken & RefreshToken 쿠키 만료시키기
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
			.body(new ApiResponse(200, "OK", "로그아웃이 완료되었습니다."));
    }

    /**
     * 회원 정보 수정 API
     *
     * @param userId 수정할 회원의 ID
     * @param request 사용자 수정 요청 데이터 (name, profile_photo_url)
     * @return 수정된 사용자 정보
     */
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody UpdateUserRequest request,
        @RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new CustomException(ErrorCode.INVALID_AUTHORIZATION_HEADER);
        }

        UserResponse updatedUser = userService.update(userId, request);
        return ResponseEntity.ok(new ApiResponse(200, "OK", "로그아웃이 완료되었습니다."));
    }

    /**
     * 비밀번호 초기화 요청 API
     *
     * @param email 사용자 이메일
     * @return 처리 결과 메시지
     */
    @PostMapping("/password/reset")
    public ResponseEntity<?> resetPasswordRequest(@RequestParam String email) {
        emailAuthService.sendAuthenticationCode(email);
		return ResponseEntity.ok(new ApiResponse(200, "OK", "비밀번호 재설정 요청이 처리되었습니다. 이메일을 확인해주세요."));
    }

    /**
     * 비밀번호 초기화 및 변경 API
     *
     * @param email 사용자 이메일
     * @param newPassword 새로운 비밀번호
     * @param authCode 인증 코드
     * @return 처리 결과 메시지
     */
    @PostMapping("/password/reset/confirm")
    public ResponseEntity<?> resetPasswordConfirm(
        @RequestParam String email,
        @RequestParam String newPassword,
        @RequestParam String authCode) {
        emailAuthService.verifyAuthenticationCode(email, authCode); // 기존 이메일 인증 로직 재사용
        userService.updatePassword(email, newPassword);
        return ResponseEntity.ok(new ApiResponse(200, "OK", "비밀번호가 성공적으로 변경되었습니다."));
    }
}
