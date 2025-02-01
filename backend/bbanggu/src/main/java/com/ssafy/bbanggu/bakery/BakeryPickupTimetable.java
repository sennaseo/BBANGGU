package com.ssafy.bbanggu.bakery;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.sql.Time;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bakery_pickup_timetable")
public class BakeryPickupTimetable {

    @Id
    @ManyToOne
    @JoinColumn(name = "bakery_id", nullable = false)
    private Bakery bakery; // 가게 ID

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private DayOfWeek dayOfWeek; // 요일

    @Column(name = "start_time", nullable = false)
    private Time startTime; // 시작 시간

    @Column(name = "end_time", nullable = false)
    private Time endTime; // 종료 시간
}

enum DayOfWeek {
    Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
}
