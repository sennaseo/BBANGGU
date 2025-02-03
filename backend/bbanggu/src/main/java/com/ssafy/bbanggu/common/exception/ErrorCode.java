package com.ssafy.bbanggu.common.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
	// ✅ 사용자 관련 예외 (1000번대)
	INVALID_REQUEST(1000, HttpStatus.BAD_REQUEST, "잘못된 요청입니다."),
	USER_NOT_FOUND(1001, HttpStatus.UNAUTHORIZED, "해당 사용자를 찾을 수 없습니다."),
	INVALID_PASSWORD(1002, HttpStatus.UNAUTHORIZED, "비밀번호가 올바르지 않습니다."),
	ACCOUNT_DEACTIVATED(1003, HttpStatus.FORBIDDEN, "이 계정은 비활성화(탈퇴)되었습니다."),
	INVALID_AUTHORIZATION_HEADER(1004, HttpStatus.UNAUTHORIZED, "유효하지 않은 Authorization 헤더입니다."),
	MISSING_AUTHORIZATION_HEADER(1005, HttpStatus.UNAUTHORIZED, "Authorization 헤더가 존재하지 않습니다."),
	EMAIL_ALREADY_IN_USE(1006, HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다."),
	PASSWORD_RESET_FAILED(1007, HttpStatus.BAD_REQUEST, "비밀번호 초기화에 실패했습니다."),

	// ✅ 가게 관련 예외 (2000번대)

	// ✅ 이메일 인증 관련 예외 (3000번대)
	EMAIL_SEND_FAILED(3000, HttpStatus.INTERNAL_SERVER_ERROR, "이메일 전송에 실패하였습니다."),
	TOO_MANY_REQUESTS(3001, HttpStatus.TOO_MANY_REQUESTS, "너무 많은 요청을 보냈습니다. 나중에 다시 시도하세요."),
	INVALID_VERIFICATION_CODE(3002, HttpStatus.BAD_REQUEST, "잘못된 인증 코드입니다."),
	EXPIRED_VERIFICATION_CODE(3003, HttpStatus.GONE, "인증 코드가 만료되었습니다."),
	USED_VERIFICATION_CODE(3004, HttpStatus.GONE, "이미 사용된 인증 코드입니다."),
	EMAIL_ALREADY_VERIFIED(3005, HttpStatus.CONFLICT, "이미 인증된 이메일입니다."),
	VERIFICATION_CODE_NOT_FOUND(3006, HttpStatus.NOT_FOUND, "해당 이메일의 인증 코드가 존재하지 않습니다."),

	// ✅ JWT 관련 예외 (4000번대)
	INVALID_ACCESS_TOKEN(4000, HttpStatus.UNAUTHORIZED, "유효하지 않은 Access Token 입니다."),
	INVALID_REFRESH_TOKEN(4001, HttpStatus.UNAUTHORIZED, "유효하지 않은 Refresh Token 입니다."),
	INVALID_TOKEN_MISSING_USERID(4002, HttpStatus.UNAUTHORIZED, "JWT 토큰에 userId 정보가 없습니다."),
	TOKEN_EXPIRED(4003, HttpStatus.UNAUTHORIZED, "토큰이 만료되었습니다."),
	TOKEN_VERIFICATION_FAILED(4004, HttpStatus.UNAUTHORIZED, "토큰 검증에 실패하였습니다."),

	// ✅ 로그아웃 관련 예외 (4500번대)
	LOGOUT_FAILED(4500, HttpStatus.BAD_REQUEST, "로그아웃 처리 중 오류가 발생했습니다."),
	USER_ALREADY_LOGGED_OUT(4501, HttpStatus.BAD_REQUEST, "이미 로그아웃된 사용자입니다."),

	// ✅ 서버 내부 오류 (5000번대)
	INTERNAL_SERVER_ERROR(5000, HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다.");

	private final int code;
	private final HttpStatus status;
	private final String message;
}
