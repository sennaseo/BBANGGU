package com.ssafy.bbanggu.bakery.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;

import com.ssafy.bbanggu.bakery.domain.Bakery;
import com.ssafy.bbanggu.bakery.dto.BakeryPickupTimetableDto;
import com.ssafy.bbanggu.bakery.dto.PickupTimeDto;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "bakery_pickup_timetable")
public class BakeryPickupTimetable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bakery_pickup_timetable_id", columnDefinition = "INT UNSIGNED", nullable = false, updatable = false)
	private Long id; // PK

	@ManyToOne
	@JoinColumn(name = "bakery_id", nullable = false)
	private Bakery bakery; // 가게 ID

    @Column private String sunday;

	@Column private String monday;

	@Column private String tuesday;

	@Column private String wednesday;

	@Column private String thursday;

	@Column private String friday;

	@Column private String saturday;

	/**
	 * 📌 픽업 시간 업데이트 (Setter 사용 없이 내부 메서드 활용)
	 */
	public void updatePickupTimetable(BakeryPickupTimetableDto dto) {
		this.monday = updateTime(dto.getMonday(), this.monday);
		this.tuesday = updateTime(dto.getTuesday(), this.tuesday);
		this.wednesday = updateTime(dto.getWednesday(), this.wednesday);
		this.thursday = updateTime(dto.getThursday(), this.thursday);
		this.friday = updateTime(dto.getFriday(), this.friday);
		this.saturday = updateTime(dto.getSaturday(), this.saturday);
		this.sunday = updateTime(dto.getSunday(), this.sunday);
	}

	/**
	 * 📌 기존 값이 존재하면 유지, 새로운 값이 들어오면 업데이트
	 */
	private String updateTime(PickupTimeDto newTime, String currentTime) {
		if (newTime == null || newTime.getStartTime() == null || newTime.getEndTime() == null) {
			return currentTime; // 새로운 값이 없으면 기존 값 유지
		}
		return newTime.getStartTime().replace(":", "") + newTime.getEndTime().replace(":", "");
	}
}
