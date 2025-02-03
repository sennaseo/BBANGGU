package com.ssafy.bbanggu.favorite;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

	Optional<Favorite> findByUserIdAndBakeryId(Long userId, Long bakeryId);

	List<Favorite> findByUserId(Long userId);

	boolean existsByUserIdAndBakeryId(Long userId, Long bakeryId);
}
