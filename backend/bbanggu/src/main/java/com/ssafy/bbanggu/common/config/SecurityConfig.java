package com.ssafy.bbanggu.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ssafy.bbanggu.common.filter.JwtAuthenticationFilter;
import com.ssafy.bbanggu.common.util.JwtUtil;

@Configuration
public class SecurityConfig {
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtUtil jwtUtil) throws Exception {
		http
			.csrf(csrf -> csrf.disable()) // CSRF 비활성화
			.authorizeHttpRequests(authz -> authz
				.requestMatchers(
					"/oauth/kakao/**",
					"/user/login",
					"/user/password/reset",
					"/user/password/reset/confirm",
					"/swagger-ui/**",
					"/v3/api-docs/**",
<<<<<<< HEAD
					"/user/register",
					"/auth/token/refresh",
					"/auth/**",
					"/user/logout"
=======
					"/v3/api-docs/**",
					"/user/register",
					"/auth/**",
					"/user/logout",
					"/**"
>>>>>>> origin/develop
				).permitAll() // 공개 API
				.requestMatchers("/saving/**").authenticated() // saving API는 인증 필요
				.anyRequest().authenticated()
			)
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
