package com.ssafy.bbanggu.auth.service;

import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service // ✅ 별도의 서비스 클래스로 등록
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepository;

	// @Override
	// public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
	// 	User user = userRepository.findByEmail(email)
	// 		.orElseThrow(() -> new UsernameNotFoundException("해당 이메일을 가진 사용자를 찾을 수 없습니다."));
	// 	return org.springframework.security.core.userdetails.User
	// 		.withUsername(user.getEmail())
	// 		.password(user.getPassword())
	// 		.roles("USER") // 필요에 따라 역할을 추가
	// 		.build();
	// }

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new UsernameNotFoundException("해당 이메일을 가진 사용자를 찾을 수 없습니다: " + email));
		return new CustomUserDetails(user);
	}

	// ✅ 새로운 메서드: userId로 사용자 조회
	public UserDetails loadUserById(Long userId) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new UsernameNotFoundException("해당 ID를 가진 사용자를 찾을 수 없습니다: " + userId));
		return new CustomUserDetails(user);
	}
}
