package com.ssafy.bbanggu.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

	@Bean
	public OpenAPI customOpenAPI() {
		String securitySchemeName = "bearerAuth";

		return new OpenAPI()
			.info(new Info()
				.title("BBANGGU API Docs")
				.version("v1.0")
				.description("BBANGGU 프로젝트 API 문서입니다. API는 인증(Bearer Token)을 필요로 하며, JWT를 사용합니다."))
			.addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
			.components(new Components()
				.addSecuritySchemes(securitySchemeName, new SecurityScheme()
					.name(securitySchemeName)
					.type(SecurityScheme.Type.HTTP)
					.scheme("bearer")
					.bearerFormat("JWT")));
	}

	@Bean
	public GroupedOpenApi userApi() {
		return GroupedOpenApi.builder()
			.group("User API")
			.pathsToMatch("/user/**")
			.build();
	}

	@Bean
	public GroupedOpenApi authApi() {
		return GroupedOpenApi.builder()
			.group("Authentication API")
			.pathsToMatch("/auth/**")
			.build();
	}

	@Bean
	public GroupedOpenApi echoApi() {
		return GroupedOpenApi.builder()
<<<<<<< HEAD
			.group("Echo Sasving API")
			.pathsToMatch("/saving/**")
			.build();
	}
=======
			.group("Echo Saving API")
			.pathsToMatch("/saving/**")
			.build();
	}

	@Bean
	public GroupedOpenApi bakeryApi(){
		return GroupedOpenApi.builder()
			.group("Bakery API")
			.pathsToMatch("/bakery/**")
			.build();
	}
>>>>>>> origin/develop
}
