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

public class JwtAuthenticationFilter extends OncePerRequestFilter {
	private final JwtUtil jwtUtil;

	public JwtAuthenticationFilter(JwtUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
		throws ServletException, IOException {
		String authorizationHeader = request.getHeader("Authorization");

		System.out.println("Authorization Header: " + authorizationHeader);

		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			String token = authorizationHeader.substring(7);

			try {
				System.out.println("Extracted Token: " + token);

				if (!jwtUtil.validateToken(token).containsKey("userId")) {
					System.out.println("Invalid JWT Token (missing userId)");
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					response.getWriter().write("{\"error\": \"Invalid JWT Token: userId missing\"}");
					return;
				}

				System.out.println("JWT Token is valid");

				Authentication authentication = jwtUtil.getAuthentication(token);
				if (authentication == null) {
					System.out.println("Failed to retrieve authentication from JWT Token");
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					response.getWriter().write("{\"error\": \"Invalid JWT authentication\"}");
					return;
				}

				SecurityContextHolder.getContext().setAuthentication(authentication);
				System.out.println("Authentication set in SecurityContext");

				System.out.println("Stored Authentication Object: " + authentication);
				System.out.println("Stored Principal: " + authentication.getPrincipal());

			} catch (Exception e) {
				System.out.println("JWT authentication failed: " + e.getMessage());
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.getWriter().write("{\"error\": \"Unauthorized: " + e.getMessage() + "\"}");
				return;
			}
		} else {
			System.out.println("No Authorization header found or not in Bearer format");
		}

		filterChain.doFilter(request, response);
	}
}
