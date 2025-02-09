package com.ssafy.bbanggu.auth.security;

import com.ssafy.bbanggu.user.domain.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

import lombok.Getter;

public class CustomUserDetails implements UserDetails {

	// ✅ userId 반환 메서드 추가
	@Getter
	private final Long userId;  // ✅ userId 사용
	private final String email;
	private final String password;
	private final Collection<? extends GrantedAuthority> authorities;

	public CustomUserDetails(User user) {
		this.userId = user.getUserId(); // ✅ userId 설정
		this.email = user.getEmail();
		this.password = user.getPassword();
		this.authorities = List.of(new SimpleGrantedAuthority(user.getUserType())); // 권한 설정
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return String.valueOf(userId);  // ✅ userId를 String으로 변환하여 반환
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
}
