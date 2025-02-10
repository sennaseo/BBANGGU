package com.ssafy.bbanggu.saving.domain;

import com.ssafy.bbanggu.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * 유저의 탄소 절감량 및 절약 금액을 저장하는 엔티티
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Table(name = "echo_saving")
@Builder
public class EchoSaving {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "echo_saving_id")
	private Long id;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	@Column(name = "saved_money", nullable = false)
	private int savedMoney;

	@Column(name = "reduced_co2e", nullable = false)
	private int reducedCo2e;

	@Column(name = "created_at", updatable = false)
	@CreationTimestamp
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	@UpdateTimestamp
	private LocalDateTime updatedAt;

	/**
	 * 절약 정보 업데이트
	 * @param reducedCo2e 추가된 Co2 절감량
	 * @param savedMoney 추가된 절약 금액
	 */
	public void updateSaving(int reducedCo2e, int savedMoney) {
		this.reducedCo2e += reducedCo2e;
		this.savedMoney += savedMoney;
	}
}
