import { useState, useEffect } from "react"
import { getBakeryById } from "../services/bakeryDetailService"
import type { BakeryType } from "../types/bakery"

export function useBakeryDetail(bakery_id?: string) {
  const [bakery, setBakery] = useState<BakeryType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchBakery() {
      if (!bakery_id) return

      try {
        setIsLoading(true)
        const data = await getBakeryById(bakery_id)
        setBakery(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred while fetching data"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchBakery()
  }, [bakery_id])

  return { bakery, isLoading, error }
}

