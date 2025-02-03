package com.ssafy.bbanggu.auth.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private final UserDetailsService userDetailsService;

	public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
		this.jwtUtil = jwtUtil;
		this.userDetailsService = userDetailsService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
		throws ServletException, IOException {

		// ✅ 1. 쿠키에서 JWT 추출
		String token = getTokenFromCookies(request);
		String email = null;

		if (token != null) {
			try {
				email = jwtUtil.getEmailFromToken(token);
			} catch (Exception e) {
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "잘못된 JWT 토큰입니다.");
				return;
			}
		}

		// ✅ 2. 토큰이 유효하고, SecurityContext에 인증 정보가 없으면 인증 진행
		if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);

			if (jwtUtil.validateToken(token)) {
				JwtAuthenticationToken authentication = new JwtAuthenticationToken(userDetails, userDetails.getAuthorities());
				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}
		}

		// ✅ 3. 필터 체인 계속 진행
		chain.doFilter(request, response);
	}

	// 🔥 쿠키에서 accessToken 찾는 메서드 추가!
	private String getTokenFromCookies(HttpServletRequest request) {
		if (request.getCookies() == null) return null;

		for (Cookie cookie : request.getCookies()) {
			if (cookie.getName().equals("accessToken")) {
				return cookie.getValue();
			}
		}
		return null;
	}
}
