package com.ssafy.bbanggu.user.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ssafy.bbanggu.auth.security.JwtTokenProvider;
import com.ssafy.bbanggu.bakery.repository.BakeryRepository;
import com.ssafy.bbanggu.bakery.service.BakeryService;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.saving.repository.EchoSavingRepository;
import com.ssafy.bbanggu.user.Role;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.dto.CreateUserRequest;
import com.ssafy.bbanggu.user.repository.UserRepository;
import com.ssafy.bbanggu.util.image.ImageService;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

	@Mock private UserRepository userRepository;
	@Mock private EchoSavingRepository echoSavingRepository;
	@Mock private PasswordEncoder passwordEncoder;
	@Mock private JwtTokenProvider jwtTokenProvider;
	@Mock private BakeryService bakeryService;
	@Mock private BakeryRepository bakeryRepository;
	@Mock private ImageService imageService;

	@InjectMocks private UserService userService;

	private User user(Long id, String encodedPassword) {
		return User.builder()
			.userId(id)
			.name("테스터")
			.email("test@bbanggu.com")
			.password(encodedPassword)
			.phone("01012345678")
			.role(Role.USER)
			.build();
	}

	// --- 회원가입 ---

	@Test
	void 회원가입시_비밀번호는_암호화되어_저장된다() {
		CreateUserRequest request = new CreateUserRequest("테스터", "test@bbanggu.com", "rawPassword1!", "01012345678", "USER");
		when(userRepository.existsByEmail(request.email())).thenReturn(false);
		when(userRepository.existsByPhone(request.phone())).thenReturn(false);
		when(passwordEncoder.encode("rawPassword1!")).thenReturn("ENCODED");

		userService.create(request);

		ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
		verify(userRepository).save(captor.capture());
		assertThat(captor.getValue().getPassword()).isEqualTo("ENCODED");
		verify(echoSavingRepository).save(any()); // 절약 정보 자동 생성
	}

	@Test
	void 중복_이메일이면_가입_실패() {
		CreateUserRequest request = new CreateUserRequest("테스터", "dup@bbanggu.com", "pw", "01012345678", "USER");
		when(userRepository.existsByEmail(request.email())).thenReturn(true);

		assertThatThrownBy(() -> userService.create(request))
			.isInstanceOf(CustomException.class)
			.hasMessage(ErrorCode.EMAIL_ALREADY_IN_USE.getMessage());
		verify(userRepository, never()).save(any());
	}

	@Test
	void 중복_전화번호면_가입_실패() {
		CreateUserRequest request = new CreateUserRequest("테스터", "new@bbanggu.com", "pw", "01012345678", "USER");
		when(userRepository.existsByEmail(request.email())).thenReturn(false);
		when(userRepository.existsByPhone(request.phone())).thenReturn(true);

		assertThatThrownBy(() -> userService.create(request))
			.isInstanceOf(CustomException.class)
			.hasMessage(ErrorCode.PHONE_NUMBER_ALREADY_EXISTS.getMessage());
	}

	// --- 로그인 ---

	@Test
	void 로그인_성공시_토큰을_발급하고_리프레시토큰을_저장한다() {
		User user = user(1L, "ENCODED");
		when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
		when(passwordEncoder.matches("rawPassword1!", "ENCODED")).thenReturn(true);
		when(jwtTokenProvider.createAccessToken(eq(1L), anyMap())).thenReturn("ACCESS");
		when(jwtTokenProvider.createRefreshToken(1L)).thenReturn("REFRESH");

		Map<String, Object> result = userService.login(user.getEmail(), "rawPassword1!");

		assertThat(result).containsEntry("access_token", "ACCESS")
			.containsEntry("refresh_token", "REFRESH")
			.containsEntry("user_type", "USER");
		assertThat(user.getRefreshToken()).isEqualTo("REFRESH");
		verify(userRepository).save(user);
	}

	@Test
	void 비밀번호가_틀리면_로그인_실패() {
		User user = user(1L, "ENCODED");
		when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
		when(passwordEncoder.matches("wrong", "ENCODED")).thenReturn(false);

		assertThatThrownBy(() -> userService.login(user.getEmail(), "wrong"))
			.isInstanceOf(CustomException.class)
			.hasMessage(ErrorCode.INVALID_PASSWORD.getMessage());
		verify(jwtTokenProvider, never()).createAccessToken(anyLong(), anyMap());
	}

	@Test
	void 없는_이메일이면_로그인_실패() {
		when(userRepository.findByEmail("ghost@bbanggu.com")).thenReturn(Optional.empty());

		assertThatThrownBy(() -> userService.login("ghost@bbanggu.com", "pw"))
			.isInstanceOf(CustomException.class)
			.hasMessage(ErrorCode.USER_NOT_FOUND.getMessage());
	}

	@Test
	void 탈퇴한_회원이면_로그인_실패() {
		User user = user(1L, "ENCODED");
		user.delete(); // 논리 삭제

		when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

		assertThatThrownBy(() -> userService.login(user.getEmail(), "pw"))
			.isInstanceOf(CustomException.class)
			.hasMessage(ErrorCode.ACCOUNT_DEACTIVATED.getMessage());
	}

	// --- 로그아웃 ---

	@Test
	void 로그아웃시_리프레시토큰이_삭제된다() {
		User user = user(1L, "ENCODED");
		user.setRefreshToken("REFRESH");
		when(userRepository.findById(1L)).thenReturn(Optional.of(user));

		userService.logout(1L);

		assertThat(user.getRefreshToken()).isNull();
		verify(userRepository).save(user);
	}
}
