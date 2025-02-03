import { ProfileSection } from "./ProfileSection"
import { ReservationList } from "./ReservationList"
import type { ReservationType, UserType } from "../../../types/bakery"

interface TicketShapeProps {
  reservations: ReservationType | null
  userData: UserType | null
}

export function TicketShape({ reservations, userData }: TicketShapeProps) {
  return (
    <div className="bg-white rounded-xl">
      <ProfileSection user={userData} />
      <div></div>
      <div>
        <ReservationList reservations={reservations ? [reservations] : []} />
      </div>
    </div>
  )
}

