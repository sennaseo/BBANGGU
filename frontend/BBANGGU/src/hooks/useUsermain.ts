import { useState, useEffect } from "react"
import { fetchBestPackages, fetchRecommendedStores } from "../services/usermainService"
import type { Store, Package } from "../types/bakery"

export function useUsermain() {
  const [searchQuery, setSearchQuery] = useState("")
  const [bestPackages, setBestPackages] = useState<Package[]>([])
  const [recommendedStores, setRecommendedStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const [bestPackagesData, recommendedStoresData] = await Promise.all([
          fetchBestPackages(),
          fetchRecommendedStores(),
        ])
        setBestPackages(bestPackagesData)
        setRecommendedStores(recommendedStoresData)
      } catch (error) {
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, []) // searchQuery를 의존성 배열에서 제거

  const toggleLike = (bakery_id: number, is_liked: boolean) => {
    console.log(`Store ${bakery_id} liked state: ${!is_liked}`)
    setRecommendedStores((prevStores) =>
      prevStores.map((store) =>
        store.bakery_id === bakery_id
          ? { ...store, is_liked: !is_liked, likes_count: is_liked ? store.likes_count - 1 : store.likes_count + 1 }
          : store,
      ),
    )
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

