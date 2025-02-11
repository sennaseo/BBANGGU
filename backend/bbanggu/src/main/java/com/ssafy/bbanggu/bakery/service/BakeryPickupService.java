package com.ssafy.bbanggu.bakery.service;

import com.ssafy.bbanggu.bakery.Bakery;
import com.ssafy.bbanggu.bakery.BakeryPickupTimetable;
import com.ssafy.bbanggu.bakery.dto.BakeryPickupTimetableDto;
import com.ssafy.bbanggu.bakery.dto.PickupTimeDto;
import com.ssafy.bbanggu.bakery.repository.BakeryPickupTimetableRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BakeryPickupService {

	private final BakeryPickupTimetableRepository bakeryPickupTimetableRepository;

	public PickupTimeDto getPickupTimetable(Long bakeryId) {
		// 현재 요일 가져오기
		String today = LocalDate.now().getDayOfWeek().name().toLowerCase();

		Optional<BakeryPickupTimetable> optionaltimetable = bakeryPickupTimetableRepository.findByBakery_BakeryId(bakeryId);
		if (optionaltimetable.isEmpty()) return null;

		BakeryPickupTimetable timetable = optionaltimetable.get();

		// 오늘 요일의 픽업 시간 반환 (없으면 null)
		String todayTime = switch (today) {
			case "sunday" -> timetable.getSunday();
			case "monday" -> timetable.getMonday();
			case "tuesday" -> timetable.getTuesday();
			case "wednesday" -> timetable.getWednesday();
			case "thursday" -> timetable.getThursday();
			case "friday" -> timetable.getFriday();
			case "saturday" -> timetable.getSaturday();
			default -> null;
		};

		// 시간이 없거나 형식이 잘못되었으면 null 반환
		if (todayTime == null || todayTime.length() != 8) {
			return null;
		}

		// "17002130" → "17:00" & "21:30" 변환
		return parsePickupTime(todayTime);
	}

	/**
	 * "HHmmHHmm" 형태의 문자열을 { startTime: "HH:mm", endTime: "HH:mm" } 객체로 변환
	 */
	private PickupTimeDto parsePickupTime(String rawTime) {
		try {
			String startHour = rawTime.substring(0, 2);
			String startMinute = rawTime.substring(2, 4);
			String endHour = rawTime.substring(4, 6);
			String endMinute = rawTime.substring(6, 8);

			return new PickupTimeDto(startHour + ":" + startMinute, endHour + ":" + endMinute);
		} catch (Exception e) {
			return null; // 변환 중 오류 발생 시 null 반환
		}
	}

	@Transactional
	public void createPickupTime(Bakery bakery, BakeryPickupTimetableDto request) {
		// 새로운 픽업 시간 등록
		BakeryPickupTimetable timetable = BakeryPickupTimetable.builder()
			.bakery(bakery)
			.sunday(formatTime(request.getSunday()))
			.monday(formatTime(request.getMonday()))
			.tuesday(formatTime(request.getTuesday()))
			.wednesday(formatTime(request.getWednesday()))
			.thursday(formatTime(request.getThursday()))
			.friday(formatTime(request.getFriday()))
			.saturday(formatTime(request.getSaturday()))
			.build();

		bakeryPickupTimetableRepository.save(timetable);
	}

	/**
	 * { startTime: "HH:mm", endTime: "HH:mm" } → "HHmmHHmm" 변환
	 */
	private String formatTime(PickupTimeDto timeDto) {
		if (timeDto == null || timeDto.getStartTime() == null || timeDto.getEndTime() == null) return null;
		return timeDto.getStartTime().replace(":", "") + timeDto.getEndTime().replace(":", "");
	}

	@Transactional
	public void updatePickupTime(Bakery bakery, BakeryPickupTimetableDto request) {
		// 기존 데이터 조회
		BakeryPickupTimetable timetable = bakeryPickupTimetableRepository.findByBakery_BakeryId(bakery.getBakeryId())
			.orElse(BakeryPickupTimetable.builder().bakery(bakery).build()); // 없으면 새로 생성

		// 업데이트할 데이터 설정
		timetable.updatePickupTimetable(request);
		bakeryPickupTimetableRepository.save(timetable);
	}

}
