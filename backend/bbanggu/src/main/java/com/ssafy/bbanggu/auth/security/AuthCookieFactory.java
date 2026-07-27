package com.ssafy.bbanggu.auth.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

/**
 * 인증 쿠키(access/refresh) 생성을 한 곳에서 관리한다.
 * - Secure 속성을 환경(app.cookie-secure)에 따라 분기: 운영 HTTPS=true, 로컬 HTTP=false
 *   (Secure 쿠키는 HTTP 연결에서 저장/전송되지 않아, 로컬에서 refresh가 무조건 실패하는 문제 방지)
 * - refreshToken 은 /auth/token/refresh 에서만 필요하므로 path 를 좁혀 매 요청 노출을 막는다.
 */
@Component
public class AuthCookieFactory {

	private static final String REFRESH_PATH = "/auth/token/refresh";
	private static final long ACCESS_MAX_AGE = 30 * 60;             // 30분
	private static final long REFRESH_MAX_AGE = 7 * 24 * 60 * 60;   // 7일

	private final boolean secure;

	public AuthCookieFactory(@Value("${app.cookie-secure:false}") boolean secure) {
		this.secure = secure;
	}

	/** access token 쿠키 (프론트는 헤더 방식이라 httpOnly=false 로 JS가 읽을 수 있게 둔다) */
	public ResponseCookie accessToken(String value) {
		return base("accessToken", value, false, "/", ACCESS_MAX_AGE);
	}

	/** refresh token 쿠키 (httpOnly + refresh 경로로 path 제한) */
	public ResponseCookie refreshToken(String value) {
		return base("refreshToken", value, true, REFRESH_PATH, REFRESH_MAX_AGE);
	}

	/** 로그아웃 시 즉시 만료(maxAge=0) — path 는 발급 때와 동일해야 브라우저가 지운다 */
	public ResponseCookie expiredAccessToken() {
		return base("accessToken", "", false, "/", 0);
	}

	public ResponseCookie expiredRefreshToken() {
		return base("refreshToken", "", true, REFRESH_PATH, 0);
	}

	private ResponseCookie base(String name, String value, boolean httpOnly, String path, long maxAge) {
		return ResponseCookie.from(name, value)
			.httpOnly(httpOnly)
			.secure(secure)
			.sameSite("Lax")
			.path(path)
			.maxAge(maxAge)
			.build();
	}
}
