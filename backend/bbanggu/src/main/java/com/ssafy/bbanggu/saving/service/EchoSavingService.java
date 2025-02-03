package com.ssafy.bbanggu.saving.service;

import com.ssafy.bbanggu.saving.domain.EchoSaving;
import com.ssafy.bbanggu.saving.dto.SavingResponse;
import com.ssafy.bbanggu.saving.dto.TotalSavingResponse;
import com.ssafy.bbanggu.saving.dto.UpdateSavingRequest;
import com.ssafy.bbanggu.saving.repository.EchoSavingRepository;
import com.ssafy.bbanggu.user.repository.UserRepository;
import com.ssafy.bbanggu.user.domain.User;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EchoSavingService {

	private final EchoSavingRepository echoSavingRepository;
	private final UserRepository userRepository;

	public SavingResponse getUserSaving(Long userId) {
		// 🔹 userId로 User 객체 조회 (JpaRepository 기본 제공 메서드 사용 (findById))
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new IllegalArgumentException("User not found"));

		// 🔹 user 객체로 검색
		EchoSaving saving = echoSavingRepository.findByUser(user)
			.orElseGet(() -> {
				System.out.println("🚨 해당 유저의 saving 데이터 없음. 기본값 반환.");
				return new EchoSaving(user, 0, 0); // 기본값 생성
			});

		return SavingResponse.builder()
			.reducedCo2e(saving.getReducedCo2e())
			.savedMoney(saving.getSavedMoney())
			.build();
	}

	@Transactional
	public void updateUserSaving(Long userId, UpdateSavingRequest request) {
		if (userId == null) {
			throw new IllegalArgumentException("User ID must not be null");
		}

		User user = userRepository.findById(userId)
			.orElseThrow(() -> new IllegalArgumentException("User not found"));

		// 기존 EchoSaving을 찾고, 없으면 새로 생성
		EchoSaving echoSaving = echoSavingRepository.findByUser(user)
			.orElseGet(() -> {
				EchoSaving newEchoSaving = EchoSaving.builder()
					.user(user) // 🔹 user 객체 직접 주입
					.savedMoney(0)
					.reducedCo2e(0)
					.build();
				return echoSavingRepository.save(newEchoSaving);
			});

		// 금액 및 탄소 절감량 업데이트
		echoSaving.update(request.getSavedMoney(), request.getReducedCo2e());
		echoSavingRepository.save(echoSaving);
	}

	// ✅ 전체 유저의 누적 탄소 절감량 및 절약 금액 조회 메서드
	@Transactional(readOnly = true)
	public TotalSavingResponse getTotalSaving() {
		int totalSavedMoney = echoSavingRepository.sumTotalSavedMoney();
		int totalReducedCo2e = echoSavingRepository.sumTotalReducedCo2e();

		return new TotalSavingResponse(totalSavedMoney, totalReducedCo2e);
	}

}
