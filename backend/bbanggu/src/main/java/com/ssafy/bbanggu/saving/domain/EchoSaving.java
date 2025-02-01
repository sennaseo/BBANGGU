package com.ssafy.bbanggu.saving.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.ssafy.bbanggu.user.domain.User;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EchoSaving {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long echoSavingId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false)
	private int savedMoney;

	@Column(nullable = false)
	private int reducedCo2e;

	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(nullable = false)
	private LocalDateTime updatedAt;

	@Builder
	public EchoSaving(User user, int savedMoney, int reducedCo2e) {
		this.user = user;
		this.savedMoney = savedMoney;
		this.reducedCo2e = reducedCo2e;
		this.createdAt = LocalDateTime.now();
		this.updatedAt = LocalDateTime.now();
	}

	public void update(int savedMoney, int reducedCo2e) {
		this.savedMoney += savedMoney;
		this.reducedCo2e += reducedCo2e;
		this.updatedAt = LocalDateTime.now();
	}
}
