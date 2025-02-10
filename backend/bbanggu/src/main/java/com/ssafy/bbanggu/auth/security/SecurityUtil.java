package com.ssafy.bbanggu.auth.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

	// ✅ 현재 로그인한 사용자 정보 가져오기
	public static CustomUserDetails getCurrentUserDetails() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || !authentication.isAuthenticated()) {
			return null; // 로그인하지 않은 경우
		}

		return (CustomUserDetails) authentication.getPrincipal();
	}

}
