package com.ssafy.bbanggu.auth.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import java.io.IOException;

import com.ssafy.bbanggu.auth.service.CustomUserDetailsService;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;
	private final CustomUserDetailsService userDetailsService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
		throws ServletException, IOException {
		// 토큰 후보: Authorization 헤더 → accessToken(httpOnly) 쿠키 순으로 시도.
		// 헤더는 구버전 프론트 하위호환용이고, 현재 프론트는 쿠키만 쓴다.
		// 유효하지 않은 토큰(만료·위조·"null" 문자열 등)은 인증 없이 통과시킨다 —
		// 보호된 엔드포인트는 이후 인가 단계에서 401로 걸러지고, 공개 엔드포인트는 게스트로 접근 가능해야 하기 때문.
		for (String token : new String[] { getTokenFromHeader(request), getTokenFromCookie(request) }) {
			if (token == null) {
				continue;
			}
			try {
				if (jwtTokenProvider.validateAccessToken(token)) {
					Claims claims = jwtTokenProvider.getClaimsFromAccessToken(token);
					Long userId = Long.parseLong(claims.getSubject());
					UserDetails userDetails = userDetailsService.loadUserById(userId);

					UsernamePasswordAuthenticationToken authentication =
						new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
					SecurityContextHolder.getContext().setAuthentication(authentication);
					break;
				}
			} catch (Exception e) {
				SecurityContextHolder.clearContext();
			}
		}

		// 다음 필터 실행 (토큰이 없거나 유효하지 않더라도 필터 체인을 계속 진행)
		chain.doFilter(request, response);
	}

	private String getTokenFromHeader(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");
		if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}
		return null;
	}

	private String getTokenFromCookie(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if (cookies == null) {
			return null;
		}
		for (Cookie cookie : cookies) {
			if ("accessToken".equals(cookie.getName())) {
				return cookie.getValue();
			}
		}
		return null;
	}

}
