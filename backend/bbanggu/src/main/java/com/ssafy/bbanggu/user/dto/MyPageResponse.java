package com.ssafy.bbanggu.user.dto;

import com.ssafy.bbanggu.saving.dto.SavingResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MyPageResponse {
	private UserResponse user;
	private SavingResponse saving;
	// private ReservationResponse reservation;
}

