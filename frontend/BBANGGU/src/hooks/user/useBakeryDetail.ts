import { useState, useEffect } from "react"
import { mockBakeries } from "../../mocks/user/bakeryMockData"
import type { BakeryType } from "../../types/bakery"

export function useBakeryDetail(bakeryId?: string) {
  const [bakery, setBakery] = useState<BakeryType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const getBakeryById = (id: string): BakeryType | undefined => {
    const numericId = Number.parseInt(id, 10)
    return mockBakeries.find((bakery) => bakery.bakeryId === numericId)
  }

  useEffect(() => {
    async function fetchBakery() {
      if (!bakeryId) return

      try {
        setIsLoading(true)
        const data = getBakeryById(bakeryId)
        if (data) {
          setBakery(data)
        } else {
          throw new Error("Bakery not found")
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred while fetching data"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchBakery()
  }, [bakeryId])

  return { bakery, isLoading, error }
}

