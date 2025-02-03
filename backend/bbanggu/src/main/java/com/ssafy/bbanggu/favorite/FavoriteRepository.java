package com.ssafy.bbanggu.favorite;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

	Optional<Favorite> findByUser_UserIdAndBakery_BakeryId(Long userId, Long bakeryId);

	List<Favorite> findByUser_UserId(Long userId);

	boolean existsByUser_UserIdAndBakery_BakeryId(Long userId, Long bakeryId);
}
