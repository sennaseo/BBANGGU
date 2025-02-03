interface TopProduct {
    name: string
    count: number
  }
  
  interface TopSectionProps {
    storeName: string
    topProducts: TopProduct[]
    totalInventory: number
  }
  
  export function TopSection({ storeName, topProducts, totalInventory }: TopSectionProps) {
    return (
      <div className="space-y-6">
        {/* Title centered at the very top */}
        <h1 className="text-2xl font-bold text-center mb-8">재고 관리 리포트</h1>
  
        {/* Store info and image */}
        <div className="relative mb-4">
          <p className="text-lg font-bold">
            <span className="text-[#FF9F43] text-2xl">{storeName}</span> 사장님,
          </p>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%B9%B5%EC%9D%B4%EB%AA%A8%ED%8B%B0%EC%BD%98-zp9pLX4YYD0Tk3YrNXNGuxk7vxT9g8.png"
            alt="Bread icon"
            className="absolute -top-10 -right-2 w-32 h-31"
          />
        </div>
  
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-bold mb-4 text-center">재고 빵 TOP 3</h3>
            <div className="space-y-2">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-2">
                  <span className="flex-shrink-0">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                  </span>
                  <span className="flex-1">{product.name}</span>
                  <span className="text-gray-600">{product.count}개</span>
                </div>
              ))}
            </div>
          </div>
  
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-bold mb-4 text-center">총 재고</h3>
            <div className="flex flex-col items-center gap-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%20155-FUdAq2Z1zrdQGEKDGjMbTsmfY7bgqT.png"
                alt="Bread icon"
                className="w-12 h-12"
              />
              <span className="text-xl font-bold">{totalInventory}개</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  