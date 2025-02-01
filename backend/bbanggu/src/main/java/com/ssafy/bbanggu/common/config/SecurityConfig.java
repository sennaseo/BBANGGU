package com.ssafy.bbanggu.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.ssafy.bbanggu.common.filter.JwtAuthenticationFilter;
import com.ssafy.bbanggu.common.util.JwtUtil;

@Configuration
public class SecurityConfig {
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtUtil jwtUtil) throws Exception {
		http
			.csrf(csrf -> csrf.ignoringRequestMatchers(
				new AntPathRequestMatcher("/auth/**") // ✅ 인증 관련 API에서 CSRF 비활성화
			))
			.authorizeHttpRequests(authz -> authz
				.requestMatchers(
					"/oauth/kakao/**",
					"/user/login",
					"/user/password/reset",
					"/user/password/reset/confirm",
					"/swagger-ui/**",
					"/v3/api-docs/**",
					"/v3/api-docs/**",
					"/user/register",
					"/auth/**",
					"/user/logout"
				).permitAll() // 공개 API
				.requestMatchers("/saving/**").authenticated() // saving API는 인증 필요
				.anyRequest().authenticated()
			)
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // ✅ 세션 비활성화 (JWT 방식 사용)
			.addFilterBefore(new JwtAuthenticationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class) // JWT 필터 추가
			.formLogin(form -> form.disable()) // formLogin() 비활성화
			.userDetailsService(username -> null);

		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
