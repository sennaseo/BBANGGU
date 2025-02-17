package com.ssafy.bbanggu.user.dto;

import com.ssafy.bbanggu.saving.dto.SavingDto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MyPageResponse {
	private UserResponse user;
	private SavingDto saving;
}

