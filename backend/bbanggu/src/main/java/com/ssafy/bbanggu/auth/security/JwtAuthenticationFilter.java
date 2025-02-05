package com.ssafy.bbanggu.auth.security;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;

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

		System.out.println("🔥 JwtAuthenticationFilter 실행됨! 요청 URL: " + request.getRequestURI());

		// ✅ 1. 쿠키에서 JWT 추출
		String accessToken = getTokenFromCookies(request, "accessToken");
		String refreshToken = getTokenFromCookies(request, "refreshToken");

		if (accessToken != null && jwtUtil.validateToken(accessToken)) {
			// ✅ Access Token이 유효한 경우 SecurityContext에 인증 정보 설정
			System.out.println("✅ 유효한 AccessToken 감지!");
			setAuthenticationFromToken(accessToken, request);
		} else if (refreshToken != null && jwtUtil.validateToken(refreshToken)) {
			// ✅ Access Token이 만료된 경우, Refresh Token을 검증하여 새 Access Token 발급
			System.out.println("♻️ RefreshToken을 사용하여 새로운 AccessToken 발급!");
			String email = jwtUtil.getEmailFromToken(refreshToken);
			Long userId = jwtUtil.getUserIdFromToken(refreshToken); // ✅ userId 추출 추가

			// ✅ 새 Access Token 발급
			String newAccessToken = jwtUtil.generateAccessToken(email, userId);
			response.addHeader(HttpHeaders.SET_COOKIE, createAccessTokenCookie(newAccessToken)); // ✅ 쿠키에 저장

			// ✅ Refresh Token을 통해 인증 정보 설정
			setAuthenticationFromToken(newAccessToken, request);
		} else {
			System.out.println("❌ AccessToken과 RefreshToken이 유효하지 않음! SecurityContext 초기화!");
			SecurityContextHolder.clearContext();

			// ✅ JSON 응답 직접 반환 (Spring Security 기본 `401` 처리 방지)
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

			String jsonResponse = """
        {
            "code": 401,
            "status": "UNAUTHORIZED",
            "message": "Access Token이 유효하지 않습니다."
        }
        """;

			response.getWriter().write(jsonResponse);
			response.getWriter().flush();
			return;
		}

		// ✅ 3. 필터 체인 계속 진행
		chain.doFilter(request, response);
	}

	private String createAccessTokenCookie(String newAccessToken) {
		return ResponseCookie.from("accessToken", newAccessToken)
			.httpOnly(true)
			.secure(true)
			.path("/")
			.maxAge(30 * 60) // ✅ 30분 유지
			.build()
			.toString();
	}

	// 🔥 쿠키에서 accessToken 찾는 메서드 추가!
	private String getTokenFromCookies(HttpServletRequest request, String tokenName) {
		if (request.getCookies() == null) return null;

		return Arrays.stream(request.getCookies())
			.filter(cookie -> cookie.getName().equals(tokenName))
			.map(Cookie::getValue)
			.findFirst()
			.orElse(null);
	}

	private void setAuthenticationFromToken(String token, HttpServletRequest request) {
		String email = jwtUtil.getEmailFromToken(token);
		Long userId = jwtUtil.getUserIdFromToken(token);

		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		System.out.println("🔑 인증 객체 생성! 사용자: " + user.getEmail());

		UserDetails userDetails = userDetailsService.loadUserByUsername(email);

		JwtAuthenticationToken authentication = new JwtAuthenticationToken(userDetails, userDetails.getAuthorities(), userId);
		authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

		// ✅ SecurityContextHolder에 인증 정보 저장
		SecurityContextHolder.getContext().setAuthentication(authentication);
		System.out.println("✅ SecurityContextHolder에 인증 객체 저장 완료!");
	}

}
