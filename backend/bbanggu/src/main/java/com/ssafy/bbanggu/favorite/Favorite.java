package com.ssafy.bbanggu.favorite;

import com.ssafy.bbanggu.bakery.domain.Bakery;
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
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "favorite_id", columnDefinition = "INT UNSIGNED")
	private Long favoriteId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "bakery_id", nullable = false)
	private Bakery bakery;

}
