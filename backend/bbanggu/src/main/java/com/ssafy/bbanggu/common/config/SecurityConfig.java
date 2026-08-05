package com.ssafy.bbanggu.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ssafy.bbanggu.auth.security.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정 추가
			.csrf(csrf -> csrf.disable()) // ✅ CSRF 보호 비활성화
			.authorizeHttpRequests(auth -> auth
				// 인증 이전 단계에서 쓰이는 공개 API (로그인·회원가입·비밀번호 재설정·이메일 인증·토큰 재발급·카카오)
				.requestMatchers(
					"/oauth/kakao/**",
					"/user/login",
					"/user/register",
					"/user/password/reset",
					"/user/password/reset/confirm",
					"/auth/**",
					"/swagger-ui/**",
					"/v3/api-docs/**",
					"/favicon.ico",
					"/saving/all"
				).permitAll()
				// 게스트(비로그인)도 볼 수 있는 조회성 API — 메인/가게상세/지도 페이지가 토큰 없이 호출
				.requestMatchers(HttpMethod.GET,
					"/bakery",
					"/bakery/map",
					"/bakery/search",
					"/bakery/*",
					"/bread-package/bakery/*",
					"/favorite/best",
					"/review/bakery/*",
					"/review/*/rating",
					"/uploads/**"
				).permitAll()
				.anyRequest().authenticated()
			)
			.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // ✅ JWT 필터 추가
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // ✅ 세션 사용 안 함 (JWT만 사용)
			.exceptionHandling(exception -> exception
				.authenticationEntryPoint((request, response, authException) -> {
					log.debug("인증 실패: {}", authException.getMessage());

					// ✅ JSON 응답 설정
					response.setContentType("application/json");
					response.setCharacterEncoding("UTF-8");
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

					// ✅ JSON 응답 데이터
					String jsonResponse = """
                    {
                        "code": 401,
                        "status": "UNAUTHORIZED",
                        "message": "인증이 필요합니다."
                    }
                    """;

					response.getWriter().write(jsonResponse);
					response.getWriter().flush();
				})
			)
			.formLogin(form -> form.disable()); // ✅ formLogin() 비활성화

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList(
			"http://localhost:5173",
			"http://127.0.0.1:5173",
			"http://localhost:3000",
			"https://i12d102.p.ssafy.io",
			"http://i12d102.p.ssafy.io",
			"https://localhost:5173"  // HTTPS도 추가
		));
		// 같은 공유기(내부망)의 폰/태블릿에서 dev 서버로 접속하는 경우 허용
		configuration.setAllowedOriginPatterns(Arrays.asList("http://192.168.*:5173"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setExposedHeaders(Arrays.asList("Authorization", "Refresh-Token"));
		configuration.setAllowCredentials(true);
		configuration.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
