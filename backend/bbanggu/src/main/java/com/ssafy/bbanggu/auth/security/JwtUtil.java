package com.ssafy.bbanggu.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

import javax.crypto.SecretKey;

import com.ssafy.bbanggu.auth.dto.JwtToken;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;

@Component
public class JwtUtil {

	private final SecretKey secretKey;
	private static final long ACCESS_TOKEN_VALIDITY = 1000 * 60 * 30; // 30분
	private static final long REFRESH_TOKEN_VALIDITY = 1000 * 60 * 60 * 24 * 7; // 7일

	public JwtUtil(@Value("${jwt.secret}") String secret) {
		this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
	}

	/**
	 * ✅ Access Token & Refresh Token 한 번에 생성
	 */
	public JwtToken generateToken(String email, Long userId) {
		String accessToken = createAccessToken(email, userId);
		String refreshToken = createRefreshToken(email);
		return new JwtToken(accessToken, refreshToken);
	}

	/**
	 * ✅ Access Token 생성
	 */
	private String createAccessToken(String email, Long userId) {
		return Jwts.builder()
			.setSubject(email)
			.claim("userId", userId)
			.setIssuedAt(new Date())
			.setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDITY))
			.signWith(secretKey, SignatureAlgorithm.HS256)
			.compact();
	}

	/**
	 * ✅ Refresh Token 생성
	 */
	private String createRefreshToken(String email) {
		return Jwts.builder()
			.setSubject(email)
			.setIssuedAt(new Date())
			.setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_VALIDITY))
			.signWith(secretKey, SignatureAlgorithm.HS256)
			.compact();
	}

	/**
	 * ✅ 토큰 검증
	 */
	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
			return true;
		} catch (ExpiredJwtException e) {
			throw new CustomException(ErrorCode.EXPIRED_TOKEN);
		} catch (JwtException e) {
			throw new CustomException(ErrorCode.INVALID_ACCESS_TOKEN);
		}
	}

	/**
	 * ✅ 토큰에서 이메일 추출
	 */
	public String getEmailFromToken(String token) {
		return Jwts.parserBuilder()
			.setSigningKey(secretKey)
			.build()
			.parseClaimsJws(token)
			.getBody()
			.getSubject();
	}

	/**
	 * ✅ 토큰에서 User ID 추출
	 */
	public Long getUserIdFromToken(String token) {
		Claims claims = Jwts.parserBuilder()
			.setSigningKey(secretKey)
			.build()
			.parseClaimsJws(token)
			.getBody();

		return claims.get("userId", Long.class);
	}
}
