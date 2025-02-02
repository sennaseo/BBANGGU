package com.ssafy.bbanggu.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;

@Component
public class JwtUtil {
	private final SecretKey secretKey;

	public JwtUtil(@Value("${jwt.secret}") String secret) {
		this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
	}

	@Value("${jwt.expiration.access-token}")
	private long accessTokenValidity;

	@Value("${jwt.expiration.refresh-token}")
	private long refreshTokenValidity;

	/**
	 * Access Token 생성
	 */
	public String generateAccessToken(String email, Long userId) {
		return Jwts.builder()
			.setSubject(email)
			.claim("userId", userId)
			.setIssuedAt(new Date())
			.setExpiration(new Date(System.currentTimeMillis() + accessTokenValidity))
			.signWith(secretKey, SignatureAlgorithm.HS256)
			.compact();
	}

	/**
	 * Refresh Token 생성
	 */
	public String generateRefreshToken(String email) {
		return Jwts.builder()
			.setSubject(email)
			.setIssuedAt(new Date())
			.setExpiration(new Date(System.currentTimeMillis() + refreshTokenValidity))
			.signWith(secretKey, SignatureAlgorithm.HS256)
			.compact();
	}

	/**
	 * 토큰에서 이메일 추출
	 */
	public String extractEmail(String token) {
		try {
			return Jwts.parserBuilder()
				.setSigningKey(secretKey)
				.build()
				.parseClaimsJws(token)
				.getBody()
				.getSubject();
		} catch (Exception e) {
			throw new CustomException(ErrorCode.INVALID_ACCESS_TOKEN);
		}
	}

	public String refreshAccessToken(String refreshToken) {
		Claims claims = validateToken(refreshToken);
		String email = claims.getSubject();
		Long userId = claims.get("userId", Long.class);

		if (userId == null) {
			//throw new CustomException(ErrorCode.INVALID_TOKEN_MISSING_USERID);
		}

		return generateAccessToken(email, userId);
	}

	/**
	 * JWT 토큰 유효성 검증
	 */
	public Claims validateToken(String token) {
		try {
			return Jwts.parserBuilder()
				.setSigningKey(secretKey)
				.build()
				.parseClaimsJws(token)
				.getBody();
		} catch (ExpiredJwtException e) {
			throw new CustomException(ErrorCode.TOKEN_EXPIRED); // 🔹 명확한 예외 메시지 설정
		} catch (JwtException e) {
			throw new CustomException(ErrorCode.INVALID_ACCESS_TOKEN); // 🔹 유효하지 않은 토큰 예외
		}
	}

	/**
	 * JWT 토큰에서 사용자 인증 정보 가져오기
	 */
	public Authentication getAuthentication(String token) {
		Claims claims = validateToken(token);
		Long userId = claims.get("userId", Long.class);

		if (userId == null) {
			throw new CustomException(ErrorCode.INVALID_TOKEN_MISSING_USERID);
		}

		// 🔹 역할(Role)을 기본적으로 USER로 설정
		List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));

		// 🔹 SecurityContext에 저장할 Authentication 객체 생성
		Authentication authentication = new UsernamePasswordAuthenticationToken(String.valueOf(userId), null, authorities);

		System.out.println("Generated Authentication with userId: " + userId);
		return authentication;
	}

}
