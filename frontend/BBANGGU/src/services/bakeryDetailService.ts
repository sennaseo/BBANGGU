import axios from "axios"
import { mockBakeryData } from "../mocks/bakeryData"
import type { BakeryType } from "../types/bakery"

const api = axios.create({
  baseURL: "https://api.example.com", // Replace with your actual API base URL
})

export async function getBakeryByName(name: string): Promise<BakeryType> {
  try {
    // Uncomment the following line when your API is ready
    // const response = await api.get<BakeryType>(`/bakeries/${name}`)
    // return response.data

    // For now, we'll use the mock data
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
    const bakery = Object.values(mockBakeryData).find((b) => b.id === name)
    if (!bakery) {
      throw new Error("Bakery not found")
    }
    return bakery
  } catch (error) {
    console.error("Error fetching bakery details:", error)
    throw error
  }
}

