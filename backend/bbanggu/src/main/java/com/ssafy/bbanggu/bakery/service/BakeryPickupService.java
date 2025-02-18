package com.ssafy.bbanggu.bakery.service;

import com.ssafy.bbanggu.auth.security.CustomUserDetails;
import com.ssafy.bbanggu.bakery.domain.Bakery;
import com.ssafy.bbanggu.bakery.domain.BakeryPickupTimetable;
import com.ssafy.bbanggu.bakery.dto.BakeryPickupTimetableDto;
import com.ssafy.bbanggu.bakery.dto.PickupTimeDto;
import com.ssafy.bbanggu.bakery.repository.BakeryPickupTimetableRepository;
import com.ssafy.bbanggu.bakery.repository.BakeryRepository;
import com.ssafy.bbanggu.common.exception.CustomException;
import com.ssafy.bbanggu.common.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BakeryPickupService {

	private final BakeryPickupTimetableRepository bakeryPickupTimetableRepository;
	private final BakeryRepository bakeryRepository;

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


	public Map<String, PickupTimeDto> getAllPickupTimetable(CustomUserDetails userDetails, Long bakeryId) {
		Bakery bakery = bakeryRepository.findById(bakeryId)
			.orElseThrow(() -> new CustomException(ErrorCode.BAKERY_NOT_FOUND));
		if (!bakery.getUser().getUserId().equals(userDetails.getUserId())) {
			throw new CustomException(ErrorCode.USER_IS_NOT_OWNER);
		}

		Optional<BakeryPickupTimetable> optionaltimetable = bakeryPickupTimetableRepository.findByBakery_BakeryId(bakeryId);
		if (optionaltimetable.isEmpty()) return null;

		BakeryPickupTimetable timetable = optionaltimetable.get();

		Map<String, PickupTimeDto> response = new HashMap<>();
		response.put("sunday", parsePickupTime(timetable.getSunday()));
		response.put("monday", parsePickupTime(timetable.getMonday()));
		response.put("tuesday", parsePickupTime(timetable.getTuesday()));
		response.put("wednesday", parsePickupTime(timetable.getWednesday()));
		response.put("thursday", parsePickupTime(timetable.getThursday()));
		response.put("friday", parsePickupTime(timetable.getFriday()));
		response.put("saturday", parsePickupTime(timetable.getSaturday()));

		return response;
	}


	@Transactional
	public void createPickupTime(Bakery bakery, BakeryPickupTimetableDto request) {
		// 새로운 픽업 시간 등록
		// BakeryPickupTimetable timetable = BakeryPickupTimetable.builder()
		// 	.bakery(bakery)
		// 	.sunday(formatTime(request.getSunday()))
		// 	.monday(formatTime(request.getMonday()))
		// 	.tuesday(formatTime(request.getTuesday()))
		// 	.wednesday(formatTime(request.getWednesday()))
		// 	.thursday(formatTime(request.getThursday()))
		// 	.friday(formatTime(request.getFriday()))
		// 	.saturday(formatTime(request.getSaturday()))
		// 	.build();

		// 기존 데이터 조회
		BakeryPickupTimetable timetable = bakeryPickupTimetableRepository.findByBakery_BakeryId(bakery.getBakeryId())
			.orElse(BakeryPickupTimetable.builder().bakery(bakery).build()); // 없으면 새로 생성

		// 업데이트할 데이터 설정
		timetable.updatePickupTimetable(request);
		bakeryPickupTimetableRepository.save(timetable);
	}

	/**
	 * { startTime: "HH:mm", endTime: "HH:mm" } → "HHmmHHmm" 변환
	 */
	private String formatTime(PickupTimeDto timeDto) {
		if (timeDto == null || timeDto.getStartTime() == null || timeDto.getEndTime() == null) return null;
		return timeDto.getStartTime().replace(":", "") + timeDto.getEndTime().replace(":", "");
	}

	/**
	 * 픽업시간 수정
	 */
	@Transactional
	public void updatePickupTime(CustomUserDetails userDetails, Long bakeryId, BakeryPickupTimetableDto request) {
		log.info("요청 데이터: {}", request.getSaturday());
		// ✅ 유효한 빵집인지 검증 (
		Bakery bakery = bakeryRepository.findByBakeryIdAndDeletedAtIsNull(bakeryId);
		if (bakery == null) {
			throw new CustomException(ErrorCode.BAKERY_NOT_FOUND);
		}

		// ✅ 현재 로그인된 사용자가 이 가게의 사장님인지 검증
		Long userId = userDetails.getUserId();
		if (!bakery.getUser().getUserId().equals(userId)) {
			throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
		}

		// 기존 데이터 조회
		BakeryPickupTimetable timetable = bakeryPickupTimetableRepository.findByBakery_BakeryId(bakery.getBakeryId())
			.orElse(BakeryPickupTimetable.builder().bakery(bakery).build()); // 없으면 새로 생성

		// 업데이트할 데이터 설정
		timetable.updatePickupTimetable(request);
		bakeryPickupTimetableRepository.save(timetable);
	}

}
