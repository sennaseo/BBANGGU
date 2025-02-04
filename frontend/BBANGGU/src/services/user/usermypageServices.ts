import type { UserType, ReservationType, EchoSaveType } from "../../types/bakery"
import { mockUsers } from "../../mocks/user/mockUserData"

export async function getUserProfile(userId: string): Promise<UserType> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockUsers[Number.parseInt(userId)] || mockUsers[Number(Object.keys(mockUsers)[0])]
}

export async function getCurrentOrder(userId: string): Promise<ReservationType | null> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const user = mockUsers[Number.parseInt(userId)] || mockUsers[Number(Object.keys(mockUsers)[0])]
  return user.reservations[0] || null
}

export async function getLatestEchoSave(userId: string): Promise<EchoSaveType | null> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const user = mockUsers[Number.parseInt(userId)] || mockUsers[Number(Object.keys(mockUsers)[0])]
  return user.echosaves[0] || null
}

