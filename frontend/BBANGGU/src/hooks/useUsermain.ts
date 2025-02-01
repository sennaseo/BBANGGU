import { useState, useEffect } from "react"
import { fetchBestPackages, fetchRecommendedStores } from "../services/usermainService"

interface Store {
  id: string
  name: string
  rating: number
  reviewCount: number
  distance: string
  hours: string
  price: number
  originalPrice: number
  imageUrl: string
  isLiked: boolean
}

interface Package {
  id: number
  title: string
  store: string
  imageUrl: string
  isLiked: boolean
}

export function useUsermain() {
  const [searchQuery, setSearchQuery] = useState("")

  const [bestPackages, setBestPackages] = useState<Package[]>([])
  const [recommendedStores, setRecommendedStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const isMounted = true

    const loadData = async () => {
      try {
        setLoading(true)
        const [packagesData, storesData] = await Promise.all([fetchBestPackages(), fetchRecommendedStores()])

        if (isMounted) {
          setBestPackages(packagesData)
          setRecommendedStores(storesData.map((store) => ({ ...store, isLiked: false })))
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("An error occurred while fetching data"))
          setLoading(false)
        }
      }
    }

    loadData()
  }, [])

  const toggleLike = (id: string, isLiked: boolean) => {
    console.log(`Store ${id} liked state: ${!isLiked}`)
    setRecommendedStores((prevStores) =>
      prevStores.map((store) => (store.id === id ? { ...store, isLiked: !isLiked } : store)),
    )
  }

  const togglePackageLike = (id: number, isLiked: boolean) => {
    console.log(`Package ${id} liked state: ${!isLiked}`)
    setBestPackages((prevPackages) => prevPackages.map((pkg) => (pkg.id === id ? { ...pkg, isLiked: !isLiked } : pkg)))
  }

  return {
    searchQuery,
    setSearchQuery,
    bestPackages,
    recommendedStores,
    loading,
    error,
    toggleLike,
    togglePackageLike,
  }
}

