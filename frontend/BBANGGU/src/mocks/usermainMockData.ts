import type { Store, Package } from "../types/bakery"

export const mockBestPackages: Package[] = [
  {
    id: 1,
    title: "소중한 빵꾸러미",
    store: "두리주르 진평점",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%B9%B5%EC%A7%91%201-bniC4fPEVNBKjNnzhJNUJQoap3MvhM.png",
    isLiked: false,
  },
  {
    id: 2,
    title: "오후의 빵꾸러미",
    store: "파리브레드 인동점",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%B9%B5%EC%A7%91%202-25f8BlZVlSlxpmPL0euihmY0BBbb95.png",
    isLiked: true,
  },
  {
    id: 3,
    title: "초코초코 꾸러미",
    store: "두리주르 인동점",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%B9%B5%EC%A7%91%203-IgTFklGmI6kCgJmUdFBxO74D7SBWJW.png",
    isLiked: false,
  },
  {
    id: 4,
    title: "초코초코 꾸러미",
    store: "두리주르 인동점",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%B9%B5%EC%A7%91%203-IgTFklGmI6kCgJmUdFBxO74D7SBWJW.png",
    isLiked: false,
  },
  {
    id: 5,
    title: "소중한 빵꾸러미",
    store: "두리주르 진평점",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%B9%B5%EC%A7%91%201-bniC4fPEVNBKjNnzhJNUJQoap3MvhM.png",
    isLiked: false,
  },
  {
    id: 6,
    title: "오후의 빵꾸러미",
    store: "파리브레드 인동점",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%B9%B5%EC%A7%91%202-25f8BlZVlSlxpmPL0euihmY0BBbb95.png",
    isLiked: false,
  },
]

export const mockRecommendedStores: Store[] = [
  {
    id: "1",
    name: "비욘드문",
    rating: 4.3,
    reviewCount: 112,
    distance: "1km",
    hours: "픽업시간 7:00 ~ 7:30",
    price: 4000,
    originalPrice: 8000,
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%B9%B5%EC%A7%91%204-JfO4HPg5RWXN6ERVGnKFXIHctHOngp.png",
    isLiked: false,
  },
  {
    id: "2",
    name: "불란서 제빵소",
    rating: 4.5,
    reviewCount: 89,
    distance: "1.5km",
    hours: "픽업시간 7:30 ~ 8:00",
    price: 5000,
    originalPrice: 10000,
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%B9%B5%EC%A7%91%205-k8FKHud2dmcBu28loOXyVLODg3sQtg.png",
    isLiked: true,
  },
  {
    id: "3",
    name: "불란서 제빵소",
    rating: 4.5,
    reviewCount: 89,
    distance: "1.5km",
    hours: "픽업시간 7:30 ~ 8:00",
    price: 5000,
    originalPrice: 10000,
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%B9%B5%EC%A7%91%205-k8FKHud2dmcBu28loOXyVLODg3sQtg.png",
    isLiked: true,
  },
]

