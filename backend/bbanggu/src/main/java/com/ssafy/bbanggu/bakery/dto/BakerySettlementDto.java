package com.ssafy.bbanggu.bakery.dto;

import com.ssafy.bbanggu.bakery.domain.Settlement;

import jakarta.validation.constraints.NotBlank;

public record BakerySettlementDto (
	Long settlementId,
	Long userId,
	@NotBlank(message = "은행명은 필수 입력 값입니다.")
	String bankName,
	@NotBlank(message = "예금주명은 필수 입력 값입니다.")
	String accountHolderName,
	@NotBlank(message = "사업자 계좌번호는 필수 입력 값입니다.")
	String accountNumber,
	String emailForTaxInvoice,
	String businessLicenseFileUrl
){
	public static BakerySettlementDto from(Settlement settlement) {
		return new BakerySettlementDto(
			settlement.getSettlementId(),
			settlement.getUser().getUserId(),
			settlement.getBankName(),
			settlement.getAccountHolderName(),
			settlement.getAccountNumber(),
			settlement.getEmailForTaxInvoice(),
			settlement.getBusinessLicenseFileUrl()
		);
	}
}
