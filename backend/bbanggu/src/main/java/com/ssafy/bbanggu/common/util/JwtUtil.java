package com.ssafy.bbanggu.common.util;

import io.jsonwebtoken.Claims;
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

	public String generateAccessToken(String email, Long userId) {
		return Jwts.builder()
			.setSubject(email)
			.claim("userId", userId)
			.setIssuedAt(new Date())
			.setExpiration(new Date(System.currentTimeMillis() + accessTokenValidity))
			.signWith(secretKey, SignatureAlgorithm.HS256)
			.compact();
	}

	public String generateRefreshToken(String email) {
		return Jwts.builder()
			.setSubject(email)
			.setIssuedAt(new Date())
			.setExpiration(new Date(System.currentTimeMillis() + refreshTokenValidity))
			.signWith(secretKey, SignatureAlgorithm.HS256)
			.compact();
	}

	public String refreshAccessToken(String refreshToken) {
		try {
			// Refresh Token 검증 및 Claims 추출
			Claims claims = validateToken(refreshToken);

			// 새로운 Access Token 발급
			String email = claims.getSubject();
			Long userId = claims.get("userId", Long.class);
			return generateAccessToken(email, userId);

		} catch (JwtException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired refresh token");
		}
	}

	public Claims validateToken(String token) {
		try {
			return Jwts.parserBuilder()
				.setSigningKey(secretKey)
				.build()
				.parseClaimsJws(token)
				.getBody();
		} catch (JwtException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
		}
	}

	public Authentication getAuthentication(String token) {
		Claims claims = validateToken(token);
		Long userId = claims.get("userId", Long.class);

		if (userId == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token: userId is missing");
		}

		// 🔹 역할(Role)을 기본적으로 USER로 설정
		List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));

		// 🔹 SecurityContext에 저장할 Authentication 객체 생성
		Authentication authentication = new UsernamePasswordAuthenticationToken(String.valueOf(userId), null, authorities);

		System.out.println("Generated Authentication with userId: " + userId);
		return authentication;
	}

}
