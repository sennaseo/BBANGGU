import { useState, useEffect } from "react"
import { getBakeryByName } from "../services/bakeryDetailService"
import type { BakeryType } from "../types/bakery"

export function useBakeryDetail(name?: string) {
  const [bakery, setBakery] = useState<BakeryType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchBakery() {
      if (!name) return

      try {
        setIsLoading(true)
        const data = await getBakeryByName(name)
        setBakery(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred while fetching data"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchBakery()
  }, [name])

  return { bakery, isLoading, error }
}

