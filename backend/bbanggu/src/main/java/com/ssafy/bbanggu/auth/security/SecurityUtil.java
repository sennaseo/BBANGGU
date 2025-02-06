package com.ssafy.bbanggu.auth.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;

public class SecurityUtil {

	public static String getCurrentUserId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
		}

		Object principal = authentication.getPrincipal();
		if (principal instanceof String email) {
			return email;  // 이메일만 반환
		}

		throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
	}
}
