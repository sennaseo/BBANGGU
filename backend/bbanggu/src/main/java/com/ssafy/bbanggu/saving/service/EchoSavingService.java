package com.ssafy.bbanggu.saving.service;

import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.saving.domain.EchoSaving;
import com.ssafy.bbanggu.saving.dto.SavingResponse;
import com.ssafy.bbanggu.saving.dto.TotalSavingResponse;
import com.ssafy.bbanggu.saving.dto.UpdateSavingRequest;
import com.ssafy.bbanggu.saving.repository.EchoSavingRepository;
import com.ssafy.bbanggu.user.domain.User;
import com.ssafy.bbanggu.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EchoSavingService {

	private final EchoSavingRepository echoSavingRepository;
	private final UserRepository userRepository;

	/**
	 * 특정 유저의 saving 정보 반환
	 */
	@Transactional(readOnly = true)
	public SavingResponse getUserSaving(Long userId) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		EchoSaving saving = echoSavingRepository.findByUser(user)
			.orElseGet(() -> new EchoSaving(user, 0, 0)); // 기본값 반환

		return new SavingResponse(saving.getSavedMoney(), saving.getReducedCo2e());
	}

	/**
	 * 유저의 절약 정보 업데이트
	 */
	@Transactional
	public void updateUserSaving(Long userId, UpdateSavingRequest request) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		EchoSaving echoSaving = echoSavingRepository.findByUser(user)
			.orElseGet(() -> echoSavingRepository.save(new EchoSaving(user, 0, 0)));

		echoSaving.update(request.savedMoney(), request.reducedCo2e());
		echoSavingRepository.save(echoSaving);
	}

	/**
	 * 전체 유저 절약 정보 반환
	 */
	@Transactional(readOnly = true)
	public TotalSavingResponse getTotalSaving() {
		int totalSavedMoney = echoSavingRepository.sumTotalSavedMoney();
		int totalReducedCo2e = echoSavingRepository.sumTotalReducedCo2e();

		return new TotalSavingResponse(totalSavedMoney, totalReducedCo2e);
	}
}
