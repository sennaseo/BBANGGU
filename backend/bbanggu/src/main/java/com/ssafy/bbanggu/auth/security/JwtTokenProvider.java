package com.ssafy.bbanggu.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;

/**
 * JWT 생성, 검증, 파싱 담당 유틸리티 클래스
 */
@Component
public class JwtTokenProvider {

	private final SecretKey accessSecretKey;
	private final SecretKey refreshSecretKey;
	private final long accessTokenValidity;
	private final long refreshTokenValidity;

	public JwtTokenProvider(
			@Value("${jwt.secret.access}") String accessSecret,
			@Value("${jwt.secret.refresh}") String refreshSecret,
			@Value("${jwt.expiration.access-token}") long accessTokenValidity,
			@Value("${jwt.expiration.refresh-token}") long refreshTokenValidity) {
		this.accessSecretKey = Keys.hmacShaKeyFor(accessSecret.getBytes());
		this.refreshSecretKey = Keys.hmacShaKeyFor(refreshSecret.getBytes());
		this.accessTokenValidity = accessTokenValidity;
		this.refreshTokenValidity = refreshTokenValidity;
	}

	// ✅ Access Token 생성
	public String createAccessToken(Long userId, Map<String, Object> additionalClaims) {
		return Jwts.builder()
			.setSubject(String.valueOf(userId)) // 사용자 아이디 저장
			.setIssuedAt(new Date()) // 발급 시간
			.setExpiration(new Date(System.currentTimeMillis() + accessTokenValidity)) // 만료시간 설정
			.addClaims(additionalClaims)
			.signWith(accessSecretKey, SignatureAlgorithm.HS256) // HS256 알고리즘 사용
			.compact();
	}

	// ✅ Refresh Token 생성
	public String createRefreshToken(Long userId) {
		return Jwts.builder()
			.setSubject(String.valueOf(userId)) // 사용자 아이디 저장
			.setIssuedAt(new Date()) // 발급 시간
			.setExpiration(new Date(System.currentTimeMillis() + refreshTokenValidity)) // 만료시간 설정
			.signWith(refreshSecretKey, SignatureAlgorithm.HS256) // HS256 알고리즘 사용
			.compact();
	}


	// ✅ Access Token에서 사용자 ID 및 추가 정보 추출
	public Claims getClaimsFromAccessToken(String token) {
		return getClaims(token, accessSecretKey);
	}

	// ✅ Refresh Token에서 사용자 ID 추출 (추가 정보 없음)
	public Long getUserIdFromRefreshToken(String token) {
		String userIdStr = getClaims(token, refreshSecretKey).getSubject();
		return Long.parseLong(userIdStr);
	}

	// ✅ 공통 Claims 추출 로직
	private Claims getClaims(String token, SecretKey secretKey) {
		try {
			return Jwts.parserBuilder()
				.setSigningKey(secretKey)
				.build()
				.parseClaimsJws(token)
				.getBody();
		} catch (Exception e) {
			throw new CustomException(ErrorCode.TOKEN_VERIFICATION_FAILED);
		}
	}

	// ✅ Access Token 검증
	public boolean validateAccessToken(String token) {
		return validateToken(token, accessSecretKey);
	}

	// ✅ Refresh Token 검증
	public boolean validateRefreshToken(String token) {
		return validateToken(token, refreshSecretKey);
	}

	// ✅ JWT 검증
	public boolean validateToken(String token, SecretKey secretKey) {
		try {
			Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
			return true;
		} catch (ExpiredJwtException e) {
			throw new CustomException(ErrorCode.EXPIRED_TOKEN);
		} catch (MalformedJwtException e) {
			throw new CustomException(ErrorCode.INCORRECT_TOKEN_FORMAT);
		} catch (Exception e) {
			throw new CustomException(ErrorCode.TOKEN_VERIFICATION_FAILED);
		}
	}

	// ✅ JWT 남은 유효 시간 확인
	public long getRemainingExpirationTime(String token, boolean isAccessToken) {
		try {
			SecretKey key = isAccessToken ? accessSecretKey : refreshSecretKey;
			Claims claims = Jwts.parserBuilder()
				.setSigningKey(key)
				.build()
				.parseClaimsJws(token)
				.getBody();

			Date expiration = claims.getExpiration();
			return expiration.getTime() - System.currentTimeMillis();
		} catch (Exception e) {
			return 0;
		}
	}

}
