package com.ssafy.bbanggu.auth.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;

public class JwtAuthenticationToken extends AbstractAuthenticationToken {

	private final UserDetails principal;

	public JwtAuthenticationToken(UserDetails principal, Collection<? extends GrantedAuthority> authorities) {
		super(authorities);
		this.principal = principal;
		setAuthenticated(true); // 🔥 인증된 사용자로 설정
	}

	@Override
	public Object getCredentials() {
		return null; // JWT 인증이므로 비밀번호 사용 안 함
	}

	@Override
	public Object getPrincipal() {
		return principal; // ✅ 사용자 정보 반환
	}
}
