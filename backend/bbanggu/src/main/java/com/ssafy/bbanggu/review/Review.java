package com.ssafy.bbanggu.review;

import com.ssafy.bbanggu.user.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.ssafy.bbanggu.bakery.Bakery;

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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 사용자 ID

    @ManyToOne
    @JoinColumn(name = "bakery_id", nullable = false)
    private Bakery bakery; // 가게 ID

    @Column(nullable = false)
    private Integer rating; // 평점

    @Column(length = 1500)
    private String content; // 내용

    @Column(name = "review_image_url", length = 255)
    private String reviewImageUrl; // 리뷰 이미지 URL

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 생성일

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt; // 삭제일
}
