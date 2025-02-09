package com.ssafy.bbanggu.saving.service;

import com.ssafy.bbanggu.saving.domain.EchoSaving;
import com.ssafy.bbanggu.saving.dto.SavingResponse;
import com.ssafy.bbanggu.saving.repository.EchoSavingRepository;
import com.ssafy.bbanggu.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EchoSavingService {

	private final EchoSavingRepository echoSavingRepository;

	/**
	 * 특정 유저의 saving 정보 반환
	 */
	@Transactional(readOnly = true)
	public SavingResponse getUserSaving(Long userId) {
		EchoSaving saving = echoSavingRepository.findByUser_UserId(userId);
		return new SavingResponse(saving.getSavedMoney(), saving.getReducedCo2e());
	}

	/**
	 * 유저의 절약 정보 업데이트
	 */
	@Transactional
	public void updateUserSaving(Long userId, int reducedCo2e, int savedMoney) {
		EchoSaving saving = echoSavingRepository.findByUser_UserId(userId);
		saving.updateSaving(reducedCo2e, savedMoney);
		echoSavingRepository.save(saving);
	}

	/**
	 * 전체 유저 절약 정보 반환
	 */
	@Transactional(readOnly = true)
	public SavingResponse getTotalSaving() {
		int totalSavedMoney = echoSavingRepository.sumTotalSavedMoney();
		int totalReducedCo2e = echoSavingRepository.sumTotalReducedCo2e();

		return new SavingResponse(totalSavedMoney, totalReducedCo2e);
	}
}
