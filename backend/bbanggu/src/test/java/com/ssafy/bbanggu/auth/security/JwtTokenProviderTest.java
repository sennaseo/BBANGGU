package com.ssafy.bbanggu.auth.security;

import static org.assertj.core.api.Assertions.*;

import java.util.Map;

import org.junit.jupiter.api.Test;

import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;

import io.jsonwebtoken.Claims;

class JwtTokenProviderTest {

	private static final String ACCESS_SECRET = "test-access-secret-key-32bytes-min!!";
	private static final String REFRESH_SECRET = "test-refresh-secret-key-32bytes-min!";

	private JwtTokenProvider provider(long accessMs, long refreshMs) {
		return new JwtTokenProvider(ACCESS_SECRET, REFRESH_SECRET, accessMs, refreshMs);
	}

	@Test
	void 액세스토큰_생성_후_클레임_복원() {
		JwtTokenProvider provider = provider(1800000, 604800000);

		String token = provider.createAccessToken(42L, Map.of("role", "OWNER"));
		Claims claims = provider.getClaimsFromAccessToken(token);

		assertThat(claims.getSubject()).isEqualTo("42");
		assertThat(claims.get("role")).isEqualTo("OWNER");
		assertThat(provider.validateAccessToken(token)).isTrue();
	}

	@Test
	void 리프레시토큰_생성_후_userId_복원() {
		JwtTokenProvider provider = provider(1800000, 604800000);

		String token = provider.createRefreshToken(7L);

		assertThat(provider.getUserIdFromRefreshToken(token)).isEqualTo(7L);
		assertThat(provider.validateRefreshToken(token)).isTrue();
	}

	@Test
	void 액세스토큰을_리프레시_키로_검증하면_실패() {
		JwtTokenProvider provider = provider(1800000, 604800000);
		String accessToken = provider.createAccessToken(1L, Map.of());

		assertThatThrownBy(() -> provider.validateRefreshToken(accessToken))
			.isInstanceOf(CustomException.class)
			.hasMessage(ErrorCode.TOKEN_VERIFICATION_FAILED.getMessage());
	}

	@Test
	void 만료된_토큰은_EXPIRED_TOKEN() {
		JwtTokenProvider provider = provider(-1000, -1000); // 이미 만료된 토큰 발급
		String expired = provider.createAccessToken(1L, Map.of());

		assertThatThrownBy(() -> provider.validateAccessToken(expired))
			.isInstanceOf(CustomException.class)
			.hasMessage(ErrorCode.EXPIRED_TOKEN.getMessage());
	}

	@Test
	void 형식이_깨진_토큰은_INCORRECT_TOKEN_FORMAT() {
		JwtTokenProvider provider = provider(1800000, 604800000);

		assertThatThrownBy(() -> provider.validateAccessToken("not-a-jwt"))
			.isInstanceOf(CustomException.class)
			.hasMessage(ErrorCode.INCORRECT_TOKEN_FORMAT.getMessage());
	}

	@Test
	void 남은_유효시간은_유효토큰이면_양수_깨진토큰이면_0() {
		JwtTokenProvider provider = provider(1800000, 604800000);
		String token = provider.createAccessToken(1L, Map.of());

		assertThat(provider.getRemainingExpirationTime(token, true)).isPositive();
		assertThat(provider.getRemainingExpirationTime("garbage", true)).isZero();
	}
}
