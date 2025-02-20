import { ProfileSection } from "./ProfileSection";
import { ReservationList } from "./ReservationList";
import type { UserType } from "../../../types/bakery";
import { Reservation } from "../../../store/slices/reservationSlice";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getReservations } from "../../../services/user/mypage/reservation/reservationService";

interface TicketShapeProps {
  userData: UserType | null;
  params: {
    userId: number;
  };
}

export function TicketShape({ userData }: TicketShapeProps) {
  const [currentReservations, setCurrentReservations] = useState<Reservation[]>(
    []
  );

  const loadData = async () => {
    try {
      const startDate = dayjs().subtract(7, "day").format("YYYY-MM-DD");
      const endDate = dayjs().format("YYYY-MM-DD");
      const reservations = await getReservations(startDate, endDate);
      setCurrentReservations(
        reservations.filter(
          (reservation) =>
            reservation.status?.toLowerCase() === "pending" ||
            reservation.status?.toLowerCase() === "confirmed"
        )
      );
    } catch (error) {
      console.error("예약 내역 로드 실패:", error);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="bg-white rounded-xl">
      <ProfileSection user={userData} />
      <div>
        <ReservationList
          reservations={currentReservations[0] ? [currentReservations[0]] : []}
          params={{ userId: userData?.userId || 0 }}
        />
      </div>
    </div>
  );
}
