import axios from "axios"
import type { Store, Package } from "../types/bakery"
import { mockBestPackages, mockRecommendedStores } from "../mocks/usermainMockData"

const api = axios.create({
  baseURL: "https://api.example.com", // Replace with your actual API base URL
})

export async function fetchBestPackages(): Promise<Package[]> {
  try {
    // Uncomment the following line when your API is ready
    // const response = await api.get<Package[]>('/best-packages')
    // return response.data

    // For now, we'll use the mock data
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
    return mockBestPackages
  } catch (error) {
    console.error("Error fetching best packages:", error)
    throw error
  }
}

export async function fetchRecommendedStores(): Promise<Store[]> {
  try {
    // Uncomment the following line when your API is ready
    // const response = await api.get<Store[]>('/recommended-stores')
    // return response.data

    // For now, we'll use the mock data
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
    return mockRecommendedStores
  } catch (error) {
    console.error("Error fetching recommended stores:", error)
    throw error
  }
}

