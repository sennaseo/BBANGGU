import { useState, useEffect } from "react"
import { getUserProfile, getCurrentOrder, getLatestEchoSave } from "../../services/user/usermypageServices"
import type { UserType, ReservationType, EchoSaveType } from "../../types/bakery"

export function useUserMypage(userId: string) {
  const [user, setUser] = useState<UserType | null>(null)
  const [currentReservation, setCurrentReservation] = useState<ReservationType | null>(null)
  const [latestEchoSave, setLatestEchoSave] = useState<EchoSaveType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true)
        const [userData, orderData, echoSaveData] = await Promise.all([
          getUserProfile(userId),
          getCurrentOrder(userId),
          getLatestEchoSave(userId),
        ])
        setUser(userData)
        setCurrentReservation(orderData)
        setLatestEchoSave(echoSaveData)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch user data"))
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  return {
    user,
    currentReservation,
    latestEchoSave,
    isLoading: loading,
    error,
  }
}

