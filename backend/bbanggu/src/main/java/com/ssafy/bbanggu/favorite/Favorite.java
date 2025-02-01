package com.ssafy.bbanggu.favorite;

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
@Table(name = "favorite")
public class Favorite {

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
}
