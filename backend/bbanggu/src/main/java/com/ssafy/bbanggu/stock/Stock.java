package com.ssafy.bbanggu.stock;

import java.time.LocalDate;

import com.ssafy.bbanggu.bakery.Bakery;
import com.ssafy.bbanggu.bread.Bread;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "stock")
public class Stock {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "stock_id", columnDefinition = "INT UNSIGNED")
	private Long stockId; // 재고 ID

	@ManyToOne
	@JoinColumn(name = "bakery_id", nullable = false)
	private Bakery bakery; // 가게 ID

	@ManyToOne
	@JoinColumn(name = "bread_id", nullable = false)
	private Bread bread; // 빵 ID

	@Column(name = "quantity", nullable = false)
	private Integer quantity; // 수량

	@Column(name = "date", nullable = false)
	private LocalDate date;
}
