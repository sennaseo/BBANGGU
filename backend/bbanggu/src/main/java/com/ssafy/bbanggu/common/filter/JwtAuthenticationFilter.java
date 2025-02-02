package com.ssafy.bbanggu.common.filter;

import com.ssafy.bbanggu.common.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
	private final JwtUtil jwtUtil;

	// 인증이 필요 없는 URL 리스트
	private static final List<String> EXCLUDED_URLS = List.of(
		"/auth/email/send",
		"/auth/email/verify",
		"/user/login",
		"/user/register",
		"/auth/token/refresh",
		"/swagger-ui",
		"/v3/api-docs"
	);

	public JwtAuthenticationFilter(JwtUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
		throws ServletException, IOException {
		String requestURI = request.getRequestURI();

		// 인증이 필요 없는 URL이면 필터링 건너뛰기
		if (EXCLUDED_URLS.stream().anyMatch(requestURI::startsWith)) {
			filterChain.doFilter(request, response);
			return;
		}

		String authorizationHeader = request.getHeader("Authorization");

		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			String token = authorizationHeader.substring(7);

			try {
				if (!jwtUtil.validateToken(token).containsKey("userId")) {
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					response.getWriter().write("{\"error\": \"Invalid JWT Token: userId missing\"}");
					return;
				}

				Authentication authentication = jwtUtil.getAuthentication(token);
				if (authentication == null) {
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					response.getWriter().write("{\"error\": \"Invalid JWT authentication\"}");
					return;
				}

				SecurityContextHolder.getContext().setAuthentication(authentication);

			} catch (Exception e) {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.getWriter().write("{\"error\": \"Unauthorized: " + e.getMessage() + "\"}");
				return;
			}
		}

		filterChain.doFilter(request, response);
	}
}
