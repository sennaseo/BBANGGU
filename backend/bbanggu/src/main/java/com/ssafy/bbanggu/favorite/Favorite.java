package com.ssafy.bbanggu.favorite;

<<<<<<< HEAD
=======
import com.ssafy.bbanggu.bakery.Bakery;
>>>>>>> origin/develop
import com.ssafy.bbanggu.user.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
<<<<<<< HEAD
import java.time.LocalDateTime;

import com.ssafy.bbanggu.bakery.Bakery;
=======
>>>>>>> origin/develop

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "favorite")
public class Favorite {

<<<<<<< HEAD
    @Id
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 사용자 ID

    @Id
    @ManyToOne
    @JoinColumn(name = "bakery_id", nullable = false)
    private Bakery bakery; // 가게 ID

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 생성일

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt; // 삭제일
=======
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
>>>>>>> origin/develop
}
