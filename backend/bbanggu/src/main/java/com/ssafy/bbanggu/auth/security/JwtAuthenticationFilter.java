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
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;
	private final UserDetailsService userDetailsService;

	public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, UserDetailsService userDetailsService) {
		this.jwtTokenProvider = jwtTokenProvider;
		this.userDetailsService = userDetailsService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
		throws ServletException, IOException {
		System.out.println("🔥 JwtAuthenticationFilter 실행됨! 요청 URL: " + request.getRequestURI());

		// 1️⃣ 요청 헤더에서 Jwt 토큰 가져오기
		String token = getTokenFromHeader(request);

		// 2️⃣ 토큰이 존재하고, 유효한 경우에만 인증 처리
		if (token != null && jwtTokenProvider.validateToken(token)) {
			String userEmail = jwtTokenProvider.getEmailFromToken(token);
			UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

			// 3️⃣ SecurityContext에 사용자 정보 저장
			UsernamePasswordAuthenticationToken authentication =
				new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
			SecurityContextHolder.getContext().setAuthentication(authentication);
		}

		// 4️⃣ 다음 필터 실행 (토큰이 없거나 유효하지 않더라도 필터 체인을 계속 진행)
		chain.doFilter(request, response);

		// ✅ 특정 URL에서는 필터를 실행하지 않도록 예외 처리
		// if (requestURI.startsWith("/auth/kakao/login") || requestURI.startsWith("/oauth/kakao") || requestURI.equals("/favicon.ico") || requestURI.equals("/user/login")) {
		// 	// System.out.println("🚀 카카오 로그인 URL 요청 - JWT 필터 건너뜀!");
		// 	chain.doFilter(request, response);
		// 	return;
		// }

		// ✅ 1. 쿠키에서 JWT 추출
		// String accessToken = getTokenFromCookies(request, "accessToken");
		// String refreshToken = getTokenFromCookies(request, "refreshToken");
		//
		// if (accessToken != null && jwtUtil.validateToken(accessToken)) {
		// 	// ✅ Access Token이 유효한 경우 SecurityContext에 인증 정보 설정
		// 	System.out.println("✅ 유효한 AccessToken 감지!");
		// 	setAuthenticationFromToken(accessToken, request);
		// } else if (refreshToken != null && jwtUtil.validateToken(refreshToken)) {
		// 	// ✅ Access Token이 만료된 경우, Refresh Token을 검증하여 새 Access Token 발급
		// 	System.out.println("♻️ RefreshToken을 사용하여 새로운 AccessToken 발급!");
		// 	String email = jwtUtil.getEmailFromToken(refreshToken);
		// 	Long userId = jwtUtil.getUserIdFromToken(refreshToken); // ✅ userId 추출 추가
		//
		// 	// ✅ 새 Access Token 발급
		// 	String newAccessToken = jwtUtil.generateToken(email, userId).getAccessToken();
		// 	response.addHeader(HttpHeaders.SET_COOKIE, createAccessTokenCookie(newAccessToken)); // ✅ 쿠키에 저장
		//
		// 	// ✅ Refresh Token을 통해 인증 정보 설정
		// 	setAuthenticationFromToken(newAccessToken, request);
		// } else {
		// 	System.out.println("❌ AccessToken과 RefreshToken이 유효하지 않음! SecurityContext 초기화!");
		// 	SecurityContextHolder.clearContext();
		//
		// 	// ✅ JSON 응답 직접 반환 (Spring Security 기본 `401` 처리 방지)
		// 	response.setContentType("application/json");
		// 	response.setCharacterEncoding("UTF-8");
		// 	response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		//
		// 	String jsonResponse = """
        // {
        //     "code": 401,
        //     "status": "UNAUTHORIZED",
        //     "message": "Access Token이 유효하지 않습니다."
        // }
        // """;
		//
		// 	response.getWriter().write(jsonResponse);
		// 	response.getWriter().flush();
		// 	return;
		// }
		//
		// // ✅ 3. 필터 체인 계속 진행
		// chain.doFilter(request, response);
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

	// 🔥 쿠키에서 accessToken 찾는 메서드 추가!
	// private String getTokenFromCookies(HttpServletRequest request, String tokenName) {
	// 	if (request.getCookies() == null) return null;
	//
	// 	return Arrays.stream(request.getCookies())
	// 		.filter(cookie -> cookie.getName().equals(tokenName))
	// 		.map(Cookie::getValue)
	// 		.findFirst()
	// 		.orElse(null);
	// }

	// private void setAuthenticationFromToken(String token, HttpServletRequest request) {
	// 	String email = jwtUtil.getEmailFromToken(token);
	// 	Long userId = jwtUtil.getUserIdFromToken(token);
	//
	// 	User user = userRepository.findByEmail(email)
	// 		.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
	//
	// 	System.out.println("🔑 인증 객체 생성! 사용자: " + user.getEmail());
	//
	// 	UserDetails userDetails = userDetailsService.loadUserByUsername(email);
	//
	// 	JwtAuthenticationToken authentication = new JwtAuthenticationToken(userDetails, userDetails.getAuthorities(), userId);
	// 	authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
	//
	// 	// ✅ SecurityContextHolder에 인증 정보 저장
	// 	SecurityContextHolder.getContext().setAuthentication(authentication);
	// 	System.out.println("✅ SecurityContextHolder에 인증 객체 저장 완료!");
	// }

}
