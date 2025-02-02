import axios from "axios"
import { mockBakeries } from "../../mocks/user/bakeryMockData"
import type { BakeryType } from "../../types/bakery"

const api = axios.create({
  baseURL: "https://api.example.com",
})

export async function getBakeryById(bakery_id: string): Promise<BakeryType> {
  try {
    // Convert string bakery_id to number
    const numericBakeryId = Number.parseInt(bakery_id, 10)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const bakery = mockBakeries[numericBakeryId]
    if (!bakery) {
      throw new Error("Bakery not found")
    }
    return bakery
  } catch (error) {
    console.error("Error fetching bakery details:", error)
    throw error
  }
}

