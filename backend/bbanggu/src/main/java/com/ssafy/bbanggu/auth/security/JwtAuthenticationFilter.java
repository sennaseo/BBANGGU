package com.ssafy.bbanggu.auth.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
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
		System.out.println("🔥 JwtAuthenticationFilter 실행됨! 요청 URL: " + request.getRequestURI());

		// 1️⃣ 요청 헤더에서 Jwt 토큰 가져오기
		String token = getTokenFromHeader(request);

		// 2️⃣ 토큰이 존재하고, 유효한 경우에만 인증 처리
		if (token != null && jwtTokenProvider.validateToken(token)) {
			Long userId = jwtTokenProvider.getUserIdFromToken(token);
			UserDetails userDetails = userDetailsService.loadUserById(userId);

			// 3️⃣ SecurityContext에 사용자 정보 저장
			UsernamePasswordAuthenticationToken authentication =
				new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
			SecurityContextHolder.getContext().setAuthentication(authentication);
		}

		// 4️⃣ 다음 필터 실행 (토큰이 없거나 유효하지 않더라도 필터 체인을 계속 진행)
		chain.doFilter(request, response);
	}

	private String getTokenFromHeader(HttpServletRequest request) {
		// 1️⃣ 요청 헤더에서 "Authorization" 키의 값 가져오기
		String bearerToken = request.getHeader("Authorization");

		// 2️⃣ "Bearer"로 시작하는지 확인
		if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7); // "Bearer " 이후의 토큰 값만 반환
		}
		return null;
	}

}
