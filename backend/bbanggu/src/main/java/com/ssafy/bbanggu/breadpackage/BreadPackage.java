package com.ssafy.bbanggu.breadpackage;

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
@Table(name = "bread_package")
public class BreadPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bread_package_id", columnDefinition = "INT UNSIGNED")
    private Long packageId; // 패키지 ID

    @ManyToOne
    @JoinColumn(name = "bakery_id", nullable = false)
    private Bakery bakery; // 가게 ID

    @Column(nullable = false)
    private Integer price; // 가격

    @Column(nullable = false)
    private Integer quantity; // 수량

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 생성일

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt; // 삭제일

    @Column(length = 100)
    private String name; // 패키지 이름

    @Column(length = 500)
    private String description; // 패키지 설명
}
