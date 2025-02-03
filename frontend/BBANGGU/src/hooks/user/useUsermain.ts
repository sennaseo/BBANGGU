import { useState, useEffect } from "react"
import { fetchRecommendedStores, fetchBestPackages } from "../../services/user/usermainService"
import type { BakeryType, PackageType } from "../../types/bakery"

export function useUsermain() {
  const [searchQuery, setSearchQuery] = useState("")
  const [bestPackages, setBestPackages] = useState<PackageType[]>([])
  const [recommendedStores, setRecommendedStores] = useState<BakeryType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [packagesData, storesData] = await Promise.all([fetchBestPackages(), fetchRecommendedStores()])
        setBestPackages(packagesData)
        setRecommendedStores(storesData)
      } catch (error) {
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const toggleLike = (bakery_id: number) => {
    setRecommendedStores((prevStores) =>
      prevStores.map((store) =>
        store.bakery_id === bakery_id
          ? {
              ...store,
              is_liked: !store.is_liked,
              likes_count: store.is_liked ? store.likes_count - 1 : store.likes_count + 1,
            }
          : store,
      ),
    )

    console.log(`Toggled like for bakery ${bakery_id}`)
  }

  return {
    searchQuery,
    setSearchQuery,
    bestPackages,
    recommendedStores,
    loading,
    error,
    toggleLike,
  }
}

