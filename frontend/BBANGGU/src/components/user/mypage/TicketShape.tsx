import { ProfileSection } from "./ProfileSection"
import { ReservationList } from "./ReservationList"
import type { ReservationType, UserType } from "../../../types/bakery"

interface TicketShapeProps {
  reservations: ReservationType | null
  userData: UserType | null
  params: {
    userId: number
  }
}

export function TicketShape({ reservations, userData }: TicketShapeProps) {
  return (
    <div className="bg-white rounded-xl">
      <ProfileSection />
      <div>
        <ReservationList reservations={reservations ? [reservations] : []} params={{ userId: userData?.userId || 0 }} />
      </div>
    </div>
  )
}

