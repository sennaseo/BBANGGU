package com.ssafy.bbanggu.auth.security;

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
	private long accessTokenValidity = 1000 * 60 * 30; // 30분
	private long refreshTokenValidity = 1000 * 60 * 60 * 24 * 7; // 7일

	public JwtUtil(@Value("${jwt.secret}") String secret) {
		this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
	}

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
	 * 토큰 검증
	 */
	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
			return true;
		} catch (ExpiredJwtException e) {
			throw new CustomException(ErrorCode.EXPIRED_VERIFICATION_CODE);
		} catch (JwtException e) {
			throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
		}
	}

	/**
	 * 토큰에서 이메일 추출
	 */
	public String getEmailFromToken(String token) {
		return Jwts.parserBuilder()
			.setSigningKey(secretKey)
			.build()
			.parseClaimsJws(token)
			.getBody()
			.getSubject();
	}

	public Long getUserIdFromToken(String token) {
		Claims claims = Jwts.parserBuilder()
			.setSigningKey(secretKey)
			.build()
			.parseClaimsJws(token)
			.getBody();

		return claims.get("userId", Long.class);
	}
}
