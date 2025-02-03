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
<<<<<<< HEAD
=======
import java.util.List;
>>>>>>> origin/develop

public class JwtAuthenticationFilter extends OncePerRequestFilter {
	private final JwtUtil jwtUtil;

<<<<<<< HEAD
=======
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

>>>>>>> origin/develop
	public JwtAuthenticationFilter(JwtUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
		throws ServletException, IOException {
<<<<<<< HEAD
		String authorizationHeader = request.getHeader("Authorization");

		System.out.println("Authorization Header: " + authorizationHeader);
=======
		String requestURI = request.getRequestURI();

		// 인증이 필요 없는 URL이면 필터링 건너뛰기
		if (EXCLUDED_URLS.stream().anyMatch(requestURI::startsWith)) {
			filterChain.doFilter(request, response);
			return;
		}

		String authorizationHeader = request.getHeader("Authorization");
>>>>>>> origin/develop

		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			String token = authorizationHeader.substring(7);

			try {
<<<<<<< HEAD
				System.out.println("Extracted Token: " + token);

				if (!jwtUtil.validateToken(token).containsKey("userId")) {
					System.out.println("Invalid JWT Token (missing userId)");
=======
				if (!jwtUtil.validateToken(token).containsKey("userId")) {
>>>>>>> origin/develop
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					response.getWriter().write("{\"error\": \"Invalid JWT Token: userId missing\"}");
					return;
				}

<<<<<<< HEAD
				System.out.println("JWT Token is valid");

				Authentication authentication = jwtUtil.getAuthentication(token);
				if (authentication == null) {
					System.out.println("Failed to retrieve authentication from JWT Token");
=======
				Authentication authentication = jwtUtil.getAuthentication(token);
				if (authentication == null) {
>>>>>>> origin/develop
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					response.getWriter().write("{\"error\": \"Invalid JWT authentication\"}");
					return;
				}

				SecurityContextHolder.getContext().setAuthentication(authentication);
<<<<<<< HEAD
				System.out.println("Authentication set in SecurityContext");

				System.out.println("Stored Authentication Object: " + authentication);
				System.out.println("Stored Principal: " + authentication.getPrincipal());

			} catch (Exception e) {
				System.out.println("JWT authentication failed: " + e.getMessage());
=======

			} catch (Exception e) {
>>>>>>> origin/develop
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.getWriter().write("{\"error\": \"Unauthorized: " + e.getMessage() + "\"}");
				return;
			}
<<<<<<< HEAD
		} else {
			System.out.println("No Authorization header found or not in Bearer format");
=======
>>>>>>> origin/develop
		}

		filterChain.doFilter(request, response);
	}
}
