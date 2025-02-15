package com.ssafy.bbanggu.bakery.domain;

import com.ssafy.bbanggu.user.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "settlement")
public class Settlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "settlement_id", columnDefinition = "INT UNSIGNED")
    private Long settlementId; // 정산 ID

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 사용자 ID

	@OneToOne
	@JoinColumn(name = "bakery_id", nullable = false)
	private Bakery bakery;

    @Column(name = "bank_name", nullable = false, length = 100)
    private String bankName; // 은행 이름

    @Column(name = "account_holder_name", nullable = false, length = 100)
    private String accountHolderName; // 예금주 이름

    @Column(name = "account_number", nullable = false, length = 50)
    private String accountNumber; // 계좌 번호

    @Column(name = "email_for_tax_invoice", nullable = false, length = 255)
    private String emailForTaxInvoice; // 세금 계산서 이메일

    @Column(name = "business_license_file_url", length = 255)
    private String businessLicenseFileUrl; // 사업자 등록증 파일 URL

	@CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 생성일

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt; // 삭제일
}
