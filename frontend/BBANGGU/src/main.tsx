import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

declare global {
  interface Window {
    kakao: any
  }
}

const KAKAO_MAP_URL = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services,clusterer&autoload=false`

function loadKakaoMapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      console.log("카카오맵 API가 이미 로드됨")
      window.kakao.maps.load(() => {
        console.log("카카오맵 API 재초기화 완료")
        resolve()
      })
      return
    }

    const script = document.createElement("script")
    script.id = "kakao-map-script"
    script.src = KAKAO_MAP_URL
    script.async = true

    script.onload = () => {
      console.log("카카오맵 API 로드 완료")
      window.kakao.maps.load(() => {
        console.log("카카오맵 API 완전 로드됨")
        resolve()
      })
    }

    script.onerror = (error) => {
      console.error("카카오맵 API 로드 실패", error)
      reject(error)
    }

    document.head.appendChild(script)
  })
}

const Root = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadKakaoMapScript()
      .then(() => {
        console.log("카카오맵 API가 완전히 로드되었습니다.")
        setIsLoaded(true)
      })
      .catch((error) => {
        console.error("카카오맵 초기화 중 오류 발생:", error)
        setError("카카오맵을 불러오는 중 오류가 발생했습니다.")
      })

    return () => {
      const script = document.getElementById("kakao-map-script")
      if (script) {
        document.head.removeChild(script)
      }
    }
  }, [])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        카카오맵 로딩 중...
      </div>
    )
  }

  return <App />
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)