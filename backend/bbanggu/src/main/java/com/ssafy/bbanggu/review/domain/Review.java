package com.ssafy.bbanggu.review.domain;

import com.ssafy.bbanggu.reservation.Reservation;
import com.ssafy.bbanggu.user.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.ssafy.bbanggu.bakery.domain.Bakery;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "review")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id", columnDefinition = "INT UNSIGNED")
    private Long reviewId; // 리뷰 ID

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "reservation_id", nullable = false, unique = true)
	private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bakery_id", nullable = false)
	private Bakery bakery;

    @Column(nullable = false)
    private Integer rating; // 평점

    @Column(length = 1500, nullable = false)
    private String content; // 내용

    @Column(name = "review_image_url", length = 255)
    private String reviewImageUrl; // 리뷰 이미지 URL

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 생성일

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt; // 삭제일

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
	}

	public Review(
		Reservation reservation, User user, Bakery bakery,
		Integer rating, String content, String photoUrl
	) {
		this.reservation = reservation;
		this.user = user;
		this.bakery = bakery;
		this.rating = rating;
		this.content = content;
		this.reviewImageUrl = photoUrl;
		this.createdAt = LocalDateTime.now();
	}
}
