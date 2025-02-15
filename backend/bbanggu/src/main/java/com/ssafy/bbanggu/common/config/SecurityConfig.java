package com.ssafy.bbanggu.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

import java.util.Arrays;

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
				.requestMatchers(
					"/oauth/kakao/**",
					"/user/login",
					"/user/password/reset",
					"/user/password/reset/confirm",
					"/swagger-ui/**",
					"/v3/api-docs/**",
					"/user/register",
					"/auth/**",
					"/favicon.ico",
					"/saving/all",
					"/**"
				).permitAll() // ✅ 공개 API
				.anyRequest().authenticated()
			)
			.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // ✅ JWT 필터 추가
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // ✅ 세션 사용 안 함 (JWT만 사용)
			.exceptionHandling(exception -> exception
				.authenticationEntryPoint((request, response, authException) -> {
					System.out.println("❌ 인증 실패: " + authException.getMessage());

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
			"http://i12d102.p.ssafy.io"
			
		));
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
