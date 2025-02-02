package com.ssafy.bbanggu.auth.service;

import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;


/**
 * InMemoryStoreService
 * : 이메일 인증번호와 요청 제한을 관리하는 메모리 기반 저장소
 */
@Service
public class InMemoryStoreService {
	private static final Logger logger = LoggerFactory.getLogger(InMemoryStoreService.class);

	private final ConcurrentHashMap<String, Pair<String, Long>> authCodeStore = new ConcurrentHashMap<>(); // 인증번호 저장소
	private final ConcurrentHashMap<String, Long> rateLimitStore = new ConcurrentHashMap<>(); // 요청 제한 저장소

	private static final int CODE_EXPIRE_TIME = 10 * 60 * 1000;
	private static final int RATE_LIMIT_EXPIRE_TIME = 60 * 60 * 1000;

	/**
	 * 인증번호 저장
	 *
	 * @param email 사용자의 이메일
	 * @param authCode 생성된 인증번호 (6자리 숫자)
	 * @param expireTimeInSeconds 인증번호 유효 시간 (초 단위, 기본 10분)
	 */
	public void saveAuthCode(String email, String authCode, int expireTimeInSeconds) {
		long expirationTime = System.currentTimeMillis() + CODE_EXPIRE_TIME;
		authCodeStore.put(email, Pair.of(authCode, expirationTime));
		logger.info("Auth code saved for email: {}", email);
	}

	/**
	 * 인증번호 조회
	 *
	 * @param email 사용자 이메일
	 * @return 저장된 인증번호 (없으면 null 반환)
	 */
	public String getAuthCode(String email) {
		Pair<String, Long> codeData = authCodeStore.get(email);
		if (codeData == null || System.currentTimeMillis() > codeData.getRight()) {
			authCodeStore.remove(email); // 만료된 코드 삭제
			logger.warn("Auth code expired for email: {}", email);
			return null;
		}
		return codeData.getLeft();
	}

	/**
	 * 인증번호 삭제
	 * @param email 사용자 이메일
	 */
	public void deleteAuthCode(String email) {
		authCodeStore.remove(email);
		logger.info("Deleted auth code for email: {}", email);
	}

	/**
	 * 요청 제한 설정
	 * @param email 사용자 이메일
	 */
	public void setRateLimit(String email) {
		long expirationTime = System.currentTimeMillis() + RATE_LIMIT_EXPIRE_TIME;
		rateLimitStore.put(email, expirationTime);
		logger.info("Rate limit set for email: {}", email);
	}

	/**
	 * 요청 제한 확인
	 * @param email 사용자 이메일
	 */
	public boolean isRateLimited(String email) {
		Long expirationTime = rateLimitStore.get(email);
		if (expirationTime == null || System.currentTimeMillis() > expirationTime) {
			rateLimitStore.remove(email);
			return false;
		}
		return true;
	}
}
