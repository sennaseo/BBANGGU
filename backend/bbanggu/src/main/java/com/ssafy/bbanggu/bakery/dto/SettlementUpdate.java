package com.ssafy.bbanggu.bakery.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ssafy.bbanggu.bakery.domain.Settlement;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record SettlementUpdate (
	String bankName,
	String accountHolderName,
	String accountNumber,
	String emailForTaxInvoice,
	String businessLicenseFileUrl
){
	public static SettlementUpdate from(Settlement settlement) {
		return new SettlementUpdate(
			settlement.getBankName(),
			settlement.getAccountHolderName(),
			settlement.getAccountNumber(),
			settlement.getEmailForTaxInvoice(),
			settlement.getBusinessLicenseFileUrl()
		);
	}
}
