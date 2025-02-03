package com.ssafy.bbanggu.bread;

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
@Table(name = "bread_category")
public class BreadCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bread_category_id", columnDefinition = "INT UNSIGNED")
    private Long breadCategoryId; // 빵 카테고리 ID

    @Column(nullable = false, length = 100)
    private String name; // 카테고리 이름

    @Column(nullable = false)
    private Integer weight; // 가중치
}
