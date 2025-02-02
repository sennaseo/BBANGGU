package com.ssafy.bbanggu.user.controller;

import java.util.HashMap;
import java.util.Map;

import com.ssafy.bbanggu.auth.service.EmailService;
import com.ssafy.bbanggu.user.dto.CreateUserRequest;
import com.ssafy.bbanggu.user.dto.UpdateUserRequest;
import com.ssafy.bbanggu.user.dto.UserResponse;
import com.ssafy.bbanggu.user.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

<<<<<<< HEAD
@Tag(name = "User", description = "사용자 관련 API")
@RestController
@RequestMapping("/user")
public class UserController { // 사용자 관련 요청을 처리하는 컨트롤러
=======
@RestController
@RequestMapping("/user")
public class UserController {
>>>>>>> origin/develop
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
<<<<<<< HEAD
    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다. 이메일 중복 체크 후, 비밀번호는 암호화하여 저장됩니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "회원가입 성공"),
        @ApiResponse(responseCode = "400", description = "입력 데이터 누락 또는 형식 오류"),
        @ApiResponse(responseCode = "409", description = "이메일 중복 또는 이미 가입된 사용자")
    })
    @PostMapping("/register")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request, BindingResult result) {
        // 유효성 검사 실패 시 에러 응답 반환
=======
    @PostMapping("/register")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request, BindingResult result) {
        // 회원가입 요청 데이터 검증
>>>>>>> origin/develop
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

<<<<<<< HEAD
        // 유효성 검사를 통과한 경우 서비스 호출
        UserResponse response = userService.create(request);

        // 성공 응답 반환
=======
        UserResponse response = userService.create(request);
>>>>>>> origin/develop
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 회원탈퇴 API (논리적 삭제)
     *
     * @param userId 삭제할 사용자 ID
     */
    @Operation(summary = "회원탈퇴", description = "사용자를 삭제합니다.")
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        userService.delete(userId);
        return ResponseEntity.ok(Map.of("message", "User account deleted successfully."));
    }

    /**
     * 로그인 API
     *
     * @param email 사용자 이메일
     * @param password 사용자 비밀번호
     * @return 로그인 성공 시 사용자 정보
     */
    @Operation(summary = "로그인", description = "사용자가 로그인합니다.")
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestParam String email, @RequestParam String password) {
        Map<String, String> response = userService.login(email, password);
        return ResponseEntity.ok(response);
    }

    /**
     * 로그아웃 API
     *
     * @param authorizationHeader Authorization 헤더
     */
    @Operation(summary = "로그아웃", description = "사용자가 로그아웃합니다.")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid or missing Authorization header"));
        }

        // Bearer 접두사 제거
        String refreshToken = authorizationHeader.substring(7);
        userService.logout(refreshToken);

        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }

    /**
     * 회원 정보 수정 API
     *
     * @param userId 수정할 회원의 ID
     * @param request 사용자 수정 요청 데이터 (name, profile_photo_url)
     * @return 수정된 사용자 정보
     */
    @Operation(summary = "회원 정보 수정", description = "회원 정보를 수정합니다.")
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody UpdateUserRequest request,
        @RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid or missing Authorization header"));
        }

        try {
            UserResponse updatedUser = userService.update(userId, request);
            return ResponseEntity.ok(Map.of("message", "User information updated successfully", "data", updatedUser));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * 비밀번호 초기화 요청 API
     *
     * @param email 사용자 이메일
     * @return 처리 결과 메시지
     */
    @Operation(summary = "비밀번호 초기화 요청", description = "사용자의 이메일로 인증 코드를 발송합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "인증 코드 발송 성공"),
        @ApiResponse(responseCode = "400", description = "이메일 형식 오류"),
        @ApiResponse(responseCode = "404", description = "해당 이메일이 존재하지 않음")
    })
    @PostMapping("/password/reset")
    public ResponseEntity<?> resetPasswordRequest(@RequestParam String email) {
        try {
            emailAuthService.sendAuthenticationCode(email);
            return ResponseEntity.ok(Map.of("message", "Password reset request processed. Please check your email."));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("message", e.getReason()));
        }
    }

    /**
     * 비밀번호 초기화 및 변경 API
     *
     * @param email 사용자 이메일
     * @param newPassword 새로운 비밀번호
     * @param authCode 인증 코드
     * @return 처리 결과 메시지
     */
    @Operation(summary = "비밀번호 초기화", description = "사용자의 인증 코드를 확인하고, 새로운 비밀번호를 설정합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "비밀번호 초기화 성공"),
        @ApiResponse(responseCode = "400", description = "입력값 오류 또는 인증 실패"),
        @ApiResponse(responseCode = "404", description = "해당 이메일이 존재하지 않음")
    })
    @PostMapping("/password/reset/confirm")
    public ResponseEntity<?> resetPasswordConfirm(
        @RequestParam String email,
        @RequestParam String newPassword,
        @RequestParam String authCode) {
        emailAuthService.verifyAuthenticationCode(email, authCode); // 기존 이메일 인증 로직 재사용
        userService.updatePassword(email, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password successfully reset."));
    }
}
