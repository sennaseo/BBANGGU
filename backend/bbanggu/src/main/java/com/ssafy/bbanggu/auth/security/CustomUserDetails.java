package com.ssafy.bbanggu.auth.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

import com.ssafy.bbanggu.user.Role;

import lombok.Getter;

public class CustomUserDetails implements UserDetails {

	@Getter
	private Long userId;

	@Getter
	private String email;

	@Getter
	private Double latitude;

	@Getter
	private Double longitude;
	private Role role;

	public CustomUserDetails(Long userId, String email, Double latitude, Double longitude, Role role) {
		this.userId = userId;
		this.email = email;
		this.latitude = latitude;
		this.longitude = longitude;
		this.role = role;
	}

	// 역할을 SimpleGrantedAuthority 형태로 반환
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
	}

	@Override
	public String getPassword() {
		return null;
	}

	@Override
	public String getUsername() {
		return String.valueOf(userId);
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
