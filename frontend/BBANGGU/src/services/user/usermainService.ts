// import axios from "axios"
import type { BakeryType, PackageType } from "../../types/bakery"
import { mockBakeries } from "../../mocks/user/bakeryMockData"

// const api = axios.create({
//   baseURL: "https://api.example.com", // Replace with your actual API base URL
// })

export async function fetchBestPackages(): Promise<PackageType[]> {
  try {
    // Uncomment the following line when your API is ready
    // const response = await api.get<PackageType[]>('/best-packages')
    // return response.data

    // For now, we'll use the mock data
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
    return mockBakeries.map((bakery) => bakery.bread_package)
  } catch (error) {
    console.error("Error fetching best packages:", error)
    throw error
  }
}

export async function fetchRecommendedStores(): Promise<BakeryType[]> {
  try {
    // Uncomment the following line when your API is ready
    // const response = await api.get<BakeryType[]>('/recommended-stores')
    // return response.data

    // For now, we'll use the mock data
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
    return mockBakeries
  } catch (error) {
    console.error("Error fetching recommended stores:", error)
    throw error
  }
}

