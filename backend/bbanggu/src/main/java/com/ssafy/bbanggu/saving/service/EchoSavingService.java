package com.ssafy.bbanggu.saving.service;

import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;
import com.ssafy.bbanggu.saving.domain.EchoSaving;
import com.ssafy.bbanggu.saving.dto.SavingDto;
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
	 * 현재 유저의 saving 정보 반환
	 */
	@Transactional(readOnly = true)
	public SavingDto getUserSaving(CustomUserDetails userDetails) {
		User user = userRepository.findById(userDetails.getUserId())
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		EchoSaving saving = echoSavingRepository.findByUser_UserId(user.getUserId());
		return new SavingDto(saving.getSavedMoney(), saving.getReducedCo2e());
	}


	/**
	 * 유저의 절약 정보 업데이트
	 */
	@Transactional
	public void updateUserSaving(CustomUserDetails userDetails, SavingDto request) {
		User user = userRepository.findById(userDetails.getUserId())
			.orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

		EchoSaving saving = echoSavingRepository.findByUser_UserId(user.getUserId());
		saving.updateSaving(request.reducedCo2e(), request.savedMoney());
		echoSavingRepository.save(saving);
	}


	/**
	 * 전체 유저 절약 정보 반환
	 */
	@Transactional(readOnly = true)
	public SavingDto getTotalSaving() {
		int totalSavedMoney = echoSavingRepository.sumTotalSavedMoney();
		int totalReducedCo2e = echoSavingRepository.sumTotalReducedCo2e();

		return new SavingDto(totalSavedMoney, totalReducedCo2e);
	}
}
