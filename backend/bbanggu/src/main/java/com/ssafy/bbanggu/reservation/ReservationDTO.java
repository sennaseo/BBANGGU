package com.ssafy.bbanggu.reservation;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
public class ReservationDTO {
	private Long reservationId; // 예약 ID
	private Long userId; // 사용자 ID
	private Long bakeryId; // 가게 ID
	private Long breadPackageId; // 패키지 ID
	private Integer quantity; // 수량
	private Integer totalPrice; // 총 가격
	private LocalDateTime reservedPickupTime; // 예약 픽업 시간
	private LocalDateTime pickupAt; // 픽업 완료 시간
	private LocalDateTime createdAt; // 생성일
	private LocalDateTime cancelledAt; // 취소일
	private String status; // 상태
	private String orderId; // 주문(결제) ID
}
