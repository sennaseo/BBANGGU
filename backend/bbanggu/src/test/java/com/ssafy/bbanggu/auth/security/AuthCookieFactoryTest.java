package com.ssafy.bbanggu.auth.security;

import static org.assertj.core.api.Assertions.*;

import java.time.Duration;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseCookie;

class AuthCookieFactoryTest {

	@Test
	void 액세스토큰_쿠키는_httpOnly다() {
		AuthCookieFactory factory = new AuthCookieFactory(true);

		ResponseCookie cookie = factory.accessToken("TOKEN");

		assertThat(cookie.getName()).isEqualTo("accessToken");
		assertThat(cookie.isHttpOnly()).isTrue(); // XSS가 JS로 못 읽어야 함
		assertThat(cookie.isSecure()).isTrue();
		assertThat(cookie.getPath()).isEqualTo("/");
		assertThat(cookie.getMaxAge()).isEqualTo(Duration.ofMinutes(30));
		assertThat(cookie.getSameSite()).isEqualTo("Lax");
	}

	@Test
	void 리프레시토큰_쿠키는_refresh_경로로_제한된다() {
		AuthCookieFactory factory = new AuthCookieFactory(true);

		ResponseCookie cookie = factory.refreshToken("TOKEN");

		assertThat(cookie.getName()).isEqualTo("refreshToken");
		assertThat(cookie.isHttpOnly()).isTrue();
		assertThat(cookie.getPath()).isEqualTo("/auth/token/refresh");
		assertThat(cookie.getMaxAge()).isEqualTo(Duration.ofDays(7));
	}

	@Test
	void 로컬_http_환경에서는_secure가_꺼진다() {
		AuthCookieFactory factory = new AuthCookieFactory(false);

		assertThat(factory.accessToken("TOKEN").isSecure()).isFalse();
		assertThat(factory.refreshToken("TOKEN").isSecure()).isFalse();
	}

	@Test
	void 만료_쿠키는_발급_때와_같은_속성으로_maxAge_0이다() {
		AuthCookieFactory factory = new AuthCookieFactory(true);

		ResponseCookie expiredAccess = factory.expiredAccessToken();
		ResponseCookie expiredRefresh = factory.expiredRefreshToken();

		assertThat(expiredAccess.getMaxAge()).isZero();
		assertThat(expiredAccess.isHttpOnly()).isTrue(); // 발급 때와 속성이 같아야 브라우저가 지운다
		assertThat(expiredAccess.getPath()).isEqualTo("/");
		assertThat(expiredRefresh.getMaxAge()).isZero();
		assertThat(expiredRefresh.getPath()).isEqualTo("/auth/token/refresh");
	}
}
