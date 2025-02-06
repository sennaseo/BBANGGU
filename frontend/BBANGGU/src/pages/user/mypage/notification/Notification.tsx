import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

interface NotificationItem {
  id: number
  message: string
  time: string
  isRead: boolean
}

export function Notification() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      message: "주문이 완료되었습니다.",
      time: "just",
      isRead: false
    },
    {
      id: 2,
      message: "주문이 완료되었습니다.",
      time: "1h ago",
      isRead: false
    },
    {
      id: 3,
      message: "주문이 완료되었습니다.",
      time: "30m ago",
      isRead: false
    },
    {
      id: 4,
      message: "픽업이 완료되었습니다.",
      time: "30m ago",
      isRead: false
    }
  ])

  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [swipingId, setSwipingId] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent, id: number) => {
    setTouchStart(e.targetTouches[0].clientX)
    setSwipingId(id)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50 // 50px 이상 스와이프하면 삭제

    if (isLeftSwipe && swipingId) {
      setNotifications(prev => prev.filter(notification => notification.id !== swipingId))
    }

    // 초기화
    setTouchStart(null)
    setTouchEnd(null)
    setSwipingId(null)
  }

  const getSwipeStyle = (id: number) => {
    if (id !== swipingId || !touchStart || !touchEnd) return {}

    const distance = touchStart - touchEnd
    const translateX = Math.min(0, -distance)

    return {
      transform: `translateX(${translateX}px)`,
      transition: 'transform 0.1s ease',
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-5 relative border-b border-gray-100">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold absolute left-1/2 -translate-x-1/2">알림</h1>
        <div className="w-6"></div>
      </div>

      {/* 알림 목록 */}
      <div className="px-5">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="relative overflow-hidden"
            onTouchStart={(e) => handleTouchStart(e, notification.id)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              style={getSwipeStyle(notification.id)}
              className="bg-white py-4 border-b border-gray-100"
            >
              <div className="flex justify-between items-start">
                <p className="text-[#333333] text-sm">{notification.message}</p>
                <span className="text-[#B4B4B4] text-xs">{notification.time}</span>
              </div>
              <p className="text-xs text-[#B4B4B4] mt-1">
                조어사 생각대로 빵꾸러미가 확정될 때까지 기다려주세요 :)
              </p>
            </div>
            {/* 삭제 버튼 (스와이프 시 보임) */}
            <button className="absolute right-0 top-0 bottom-0 bg-white text-[#FF0000] flex items-center px-4 font-medium border-b border-gray-100">
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 