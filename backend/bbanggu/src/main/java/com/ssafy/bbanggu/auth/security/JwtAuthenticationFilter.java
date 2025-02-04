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

import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private final UserDetailsService userDetailsService;
	private final UserRepository userRepository;

	public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService, UserRepository userRepository) {
		this.jwtUtil = jwtUtil;
		this.userDetailsService = userDetailsService;
		this.userRepository = userRepository;
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
			User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

			UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);

			if (jwtUtil.validateToken(token)) {
				Long userId = user.getUserId();

				JwtAuthenticationToken authentication = new JwtAuthenticationToken(userDetails, userDetails.getAuthorities(), userId);
				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

				// ✅ SecurityContext에 userId를 저장하도록 변경
				authentication.setAuthenticated(true);
				SecurityContextHolder.getContext().setAuthentication(authentication);
				request.setAttribute("userId", userId); // ✅ 요청 속성에 userId 추가
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
