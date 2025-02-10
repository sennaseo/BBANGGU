package com.ssafy.bbanggu.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**") // 모든 API에 대해 CORS 허용
					.allowedOrigins("http://localhost:5173") // Vite 개발 서버 허용
					.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
					.allowedHeaders("*") // 모든 헤더 허용
					.allowCredentials(true); // 쿠키 인증 허용 (필요한 경우)
			}
		};
	}
}
