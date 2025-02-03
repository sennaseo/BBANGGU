package com.ssafy.bbanggu.auth.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import jakarta.validation.ConstraintViolation;
import java.util.Set;

public class EmailValidationTest {
	public static void main(String[] args) {
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();

		// 테스트 데이터
		EmailRequest request = new EmailRequest("user@example.com");

		// 검증 실행
		Set<ConstraintViolation<EmailRequest>> violations = validator.validate(request);
		if (violations.isEmpty()) {
			System.out.println("Valid email!");
		} else {
			violations.forEach(v -> System.out.println(v.getMessage()));
		}
	}
}

record EmailRequest(
	@jakarta.validation.constraints.Email(message = "Invalid email format.")
	String email
) {}
