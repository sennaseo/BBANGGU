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
	private final ConcurrentHashMap<String, Boolean> usedAuthCodes = new ConcurrentHashMap<>(); // 사용된 인증번호 저장소

	private static final int CODE_EXPIRE_TIME = 10 * 60 * 1000;
	private static final int RATE_LIMIT_EXPIRE_TIME = 60 * 60 * 1000;

	/**
	 * 인증번호 저장
	 *
	 * @param email 사용자의 이메일
	 * @param authCode 생성된 인증번호 (6자리 숫자)
	 */
	public void saveAuthCode(String email, String authCode) {
		long expirationTime = System.currentTimeMillis() + CODE_EXPIRE_TIME;
		authCodeStore.put(email, Pair.of(authCode, expirationTime));
		usedAuthCodes.remove(email); // 새 코드가 발급되면 사용된 코드 목록에서 제거
		logger.info("Auth code saved for email: {}", email);
	}

	/**
	 * 인증번호 조회
	 *
	 * @param email 사용자 이메일
	 * @return 저장된 인증번호 (없으면 null 반환)
	 */
	public Pair<String, Long> getAuthCodeData(String email) {
		Pair<String, Long> codeData = authCodeStore.get(email);

		if (codeData == null) {
			// 인증번호가 없으면 401 UNAUTHORIZED (잘못된 코드 입력 또는 새로운 코드 발급 후 이전 코드 입력)
			return null;
		}

		// 🔥 만료된 코드인지 체크 후 null 반환 (만료된 경우 `410 GONE` 처리 가능하도록)
		if (System.currentTimeMillis() > codeData.getRight()) {
			authCodeStore.remove(email);
			return null; // `verifyAuthenticationCode()`에서 `410 GONE` 처리
		}

		return codeData; // 인증번호가 유효하면 반환
	}


	/**
	 * 인증번호 삭제
	 * @param email 사용자 이메일
	 */
	public void deleteAuthCode(String email) {
		authCodeStore.remove(email);
		logger.info("Deleted auth code for email: {}", email);
	}

	public void markAuthCodeAsUsed(String email) {
		authCodeStore.remove(email); // 🔥 인증번호 삭제
		usedAuthCodes.put(email, true); // 🔥 사용된 인증번호 기록
		logger.info("Auth code marked as used for email: {}", email);
	}

	public boolean isAuthCodeUsed(String email) {
		return usedAuthCodes.containsKey(email);
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

	// public boolean verifyAuthCode(String email, String authCode) {
	// 	Pair<String, Long> codeData = authCodeStore.get(email);
	//
	// 	if (codeData == null) {
	// 		logger.warn("Auth code not found for email: {}", email);
	// 		return false; // 🔹 코드가 아예 없으면 바로 false 반환
	// 	}
	//
	// 	// 🔥 먼저 입력된 코드가 맞는지 체크!
	// 	if (!codeData.getLeft().equals(authCode)) {
	// 		logger.warn("Invalid auth code for email: {}", email);
	// 		return false; // 🔹 틀린 코드일 경우 false 반환
	// 	}
	//
	// 	// ✅ 코드가 맞다면, 만료 여부를 확인
	// 	if (System.currentTimeMillis() > codeData.getRight()) {
	// 		authCodeStore.remove(email); // 🔥 만료된 코드 삭제
	// 		logger.warn("Auth code expired for email: {}", email);
	// 		throw new CodeExpiredException("Authentication code has expired.");
	// 	}
	//
	// 	return true; // ✅ 인증 성공
	// }
}
