package com.ssafy.bbanggu.bakery;

import com.ssafy.bbanggu.user.domain.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.bbanggu.bread.Bread;
import com.ssafy.bbanggu.breadpackage.BreadPackage;
import com.ssafy.bbanggu.favorite.Favorite;
import com.ssafy.bbanggu.review.Review;
import com.ssafy.bbanggu.stock.Stock;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bakery")
public class Bakery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bakery_id", columnDefinition = "INT UNSIGNED")
    private Long bakeryId; // 가게 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 사용자 ID (연관 관계)

    @Column(nullable = false, length = 100)
    private String name; // 가게 이름

    @Column(length = 1500)
    private String description; // 가게 설명

    @Column(name = "business_registration_number", nullable = false, unique = true, length = 50)
    private String businessRegistrationNumber; // 사업자 등록 번호

    @Column(name = "address_road", nullable = false, length = 255)
    private String addressRoad; // 도로명 주소

    @Column(name = "address_detail", nullable = false, length = 150)
    private String addressDetail; // 상세 주소

    @Column(name = "photo_url", length = 255)
    private String photoUrl; // 사진 URL

    @Column(nullable = false)
    private Double latitude; // 위도

    @Column(nullable = false)
    private Double longitude; // 경도

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 생성일

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt; // 삭제일

    @Column(name = "update_at")
    private LocalDateTime updateAt; // 수정일

    // 연관 관계 설정
    @OneToMany(mappedBy = "bakery", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BakeryPickupTimetable> pickupTimetables; // 픽업 시간표

    @OneToMany(mappedBy = "bakery", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bread> breads; // 빵 목록

    @OneToMany(mappedBy = "bakery", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BreadPackage> packages; // 패키지 목록

    @OneToMany(mappedBy = "bakery", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews; // 리뷰 목록

    @OneToMany(mappedBy = "bakery", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Stock> stocks; // 재고 목록

    @OneToMany(mappedBy = "bakery", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Favorite> favorites; // 즐겨찾기 목록
}
