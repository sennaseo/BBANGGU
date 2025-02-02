package com.ssafy.bbanggu.favorite;

import com.ssafy.bbanggu.bakery.Bakery;
import com.ssafy.bbanggu.user.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "favorite")
public class Favorite {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)  // AUTO_INCREMENT를 위한 설정
	@Column(name = "favorite_id")
	private Long favoriteId;

	// 외래 키를 저장하는 id 필드 추가
	@Column(name = "user_id", columnDefinition = "INT UNSIGNED", nullable = false)
	private Long userId;

	@Column(name = "bakery_id", columnDefinition = "INT UNSIGNED", nullable = false)
	private Long bakeryId;

	@Column(name = "is_liked", nullable = false)
	private boolean isLiked;

	// user와 bakery 객체를 사용하려면, @ManyToOne 설정을 사용하지만, ID만 설정하고 싶을 경우엔 이와 같은 필드 정의가 필요합니다.
	@ManyToOne
	@JoinColumn(name = "user_id", insertable = false, updatable = false)
	private User user;

	@ManyToOne
	@JoinColumn(name = "bakery_id", insertable = false, updatable = false)
	private Bakery bakery;
}
