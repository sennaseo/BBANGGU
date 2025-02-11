package com.ssafy.bbanggu.bread;

import java.time.LocalDateTime;

import com.ssafy.bbanggu.bakery.domain.Bakery;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Bread {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bread_id", columnDefinition = "INT UNSIGNED")
	private Long breadId; // 빵 ID

	@ManyToOne
	@JoinColumn(name = "bakery_id", nullable = false)
	private Bakery bakery; // 가게 ID

	@ManyToOne
	@JoinColumn(name = "bread_category_id", nullable = false)
	private BreadCategory breadCategory; // 빵 카테고리 ID

	@Column(nullable = false, length = 100)
	private String name; // 빵 이름

	@Column(nullable = false)
	private Integer price; // 가격

	@Column(name = "bread_image_url", length = 255)
	private String breadImageUrl; // 빵 이미지 URL

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt; // 생성일

	@Column(name = "deleted_at")
	private LocalDateTime deletedAt; // 삭제일
}

