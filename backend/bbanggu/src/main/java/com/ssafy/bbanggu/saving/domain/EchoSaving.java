package com.ssafy.bbanggu.saving.domain;

import com.ssafy.bbanggu.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 유저의 탄소 절감량 및 절약 금액을 저장하는 엔티티
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "echo_saving")
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

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt = LocalDateTime.now();

	@Builder
	public EchoSaving(User user, int savedMoney, int reducedCo2e) {
		this.user = user;
		this.savedMoney = savedMoney;
		this.reducedCo2e = reducedCo2e;
	}

	public void update(int savedMoney, int reducedCo2e) {
		this.savedMoney += savedMoney;
		this.reducedCo2e += reducedCo2e;
		this.updatedAt = LocalDateTime.now();
	}
}
