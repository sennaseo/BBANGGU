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

import javax.crypto.SecretKey;

import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;

/**
 * JWT 생성, 검증, 파싱 담당 유틸리티 클래스
 */
@Component
public class JwtTokenProvider {

	private final SecretKey secretKey;
	private final long accessTokenValidity;
	private final long refreshTokenValidity;

	public JwtTokenProvider(
			@Value("${jwt.secret}") String secret,
			@Value("${jwt.expiration.access-token}") long accessTokenValidity,
			@Value("${jwt.expiration.refresh-token}") long refreshTokenValidity) {
		this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
		this.accessTokenValidity = accessTokenValidity;
		this.refreshTokenValidity = refreshTokenValidity;
	}

	// ✅ Access Token 생성
	public String createAccessToken(Long userId) {
		return generateToken(userId, accessTokenValidity);
	}

	// ✅ Refresh Token 생성
	public String createRefreshToken(Long userId) {
		return generateToken(userId, refreshTokenValidity);
	}

	// ✅ 공통 JWT 생성 로직
	private String generateToken(Long userId, long validity) {
		return Jwts.builder()
				.setSubject(String.valueOf(userId)) // 사용자 아이디 저장
				.setIssuedAt(new Date()) // 발급 시간
				.setExpiration(new Date(System.currentTimeMillis() + validity)) // 만료시간 설정
				.signWith(secretKey, SignatureAlgorithm.HS256) // HS256 알고리즘 사용
				.compact();
	}

	// ✅ JWT에서 사용자 아이디 추출 (String -> Long 변환)
	public Long getUserIdFromToken(String token) {
		try {
			String userIdStr = Jwts.parserBuilder()
				.setSigningKey(secretKey)
				.build()
				.parseClaimsJws(token)
				.getBody()
				.getSubject();
			return Long.parseLong(userIdStr); // String을 Long으로 변환
		} catch (NumberFormatException e) {
			throw new CustomException(ErrorCode.TOKEN_VERIFICATION_FAILED);
		}
	}

	// ✅ JWT 검증
	public boolean validateToken(String token) {
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

	public long getRemainingExpirationTime(String token) {
		try {
			Claims claims = Jwts.parserBuilder()
				.setSigningKey(secretKey) // JWT 서명을 검증할 키
				.build()
				.parseClaimsJws(token)
				.getBody();

			Date expiration = claims.getExpiration(); // JWT 만료 시간 가져오기
			return expiration.getTime() - System.currentTimeMillis(); // 현재 시간과의 차이 반환 (밀리초 단위)
		} catch (Exception e) {
			return 0; // 만료되었거나 유효하지 않은 토큰일 경우 0 반환
		}
	}

}
