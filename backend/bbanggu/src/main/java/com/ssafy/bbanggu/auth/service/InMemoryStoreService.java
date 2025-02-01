package com.ssafy.bbanggu.auth.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;


/**
 * InMemoryStoreService
 * : 이메일 인증번호와 요청 제한을 관리하는 메모리 기반 저장소
 */
@Service
public class InMemoryStoreService {

	// 인증번호 저장소 (email -> authCode)
	private final ConcurrentHashMap<String, String> authCodeStore = new ConcurrentHashMap<>();
	// 요청 제한 저장소 (email -> 제한 만료 시간)
	private final ConcurrentHashMap<String, Long> rateLimitStore = new ConcurrentHashMap<>();

	/**
	 * 인증번호 저장
	 *
	 * @param email 사용자의 이메일
	 * @param authCode 생성된 인증번호 (6자리 숫자)
	 * @param expireTimeInSeconds 인증번호 유효 시간 (초 단위, 기본 10분)
	 */
	public void saveAuthCode(String email, String authCode, int expireTimeInSeconds) {
		// 이미 인증번호가 존재하면 저장하지 않음
		if(authCodeStore.containsKey(email)) {
			System.out.println("Auth code already exists for email: " +email);
			return;
		}

		// 인증번호 저장
		System.out.println("Saving auth code for email: " + ", authCode: " + authCode);
		authCodeStore.put(email, authCode);

		// 인증번호 만료 후 자동 삭제 (별도 스레드 실행)
		new Thread(() -> {
			try {
				Thread.sleep(expireTimeInSeconds * 1000L); // 설정된 시간만큼 대기
				authCodeStore.remove(email); // 인증번호 만료 후 삭제
				System.out.println("Auth code expired and removed for email: " + email);
			} catch (InterruptedException e) {
				Thread.currentThread().interrupt();
			}
		}).start();
	}

	/**
	 * 인증번호 조회
	 *
	 * @param email 사용자 이메일
	 * @return 저장된 인증번호 (없으면 null 반환)
	 */
	public String getAuthCode(String email) {
		System.out.println("Email: " + email + ", Stored auth code: " + authCodeStore.get(email));
		return authCodeStore.get(email);
	}

	/**
	 * 요청 제한 확인
	 *
	 * @param email 사용자 이메일
	 * @return true(요청 제한 중), false(요청 가능)
	 */
	public boolean isRateLimited(String email) {
		Long expireTime = rateLimitStore.get(email);
		return expireTime != null && expireTime > System.currentTimeMillis();
	}

	/**
	 * 요청 제한 설정
	 *
	 * @param email 사용자 이메일
	 * @param expireTimeInSeconds 요청 제한 시간 (초 단위, 기본 1시간)
	 */
	public void setRateLimit(String email, int expireTimeInSeconds) {
		rateLimitStore.put(email, System.currentTimeMillis() + (expireTimeInSeconds * 1000L));
	}

	/**
	 * 인증번호 삭제
	 *
	 * @param email 사용자 이메일
	 */
	public void deleteAuthCode(String email) {
		authCodeStore.remove(email);
	}
}
