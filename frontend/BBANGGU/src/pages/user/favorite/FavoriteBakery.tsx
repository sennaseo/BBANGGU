import { useState, useEffect } from 'react';
import { BakeryType } from '../../../types/bakery';
import { useNavigate } from 'react-router-dom';
import { HeartIcon, StarIcon } from "lucide-react"
import { MapPinIcon } from "@heroicons/react/24/solid";
import UserBottomNavigation from '../../../components/user/navigations/bottomnavigation/UserBottomNavigation';  
import { getFavoriteBakery } from '../../../services/user/favorite/userFavoriteService';
import { bakeryDetailApi } from '../../../api/user/detail/bakeryDetailApi';

export const FavoriteBakery = () => {
  const navigate = useNavigate();
  const [bakeries, setBakeries] = useState<BakeryType[]>([]);

  const handleBakeryClick = (bakeryId: number) => {
    navigate(`/user/bakery/${bakeryId}`);
  };

  useEffect(() => {
    const fetchBakeries = async () => {
      try {
        const bakeryData = await getFavoriteBakery();
        console.log("bakeryData", bakeryData);
        // bakeryData.content는 { bakeryId: number }[] 형태이므로
        // 각 bakeryId에 대해 전체 BakeryType을 가져옵니다.
        const fullBakeries: BakeryType[] = await Promise.all(
          bakeryData.content.map((item: { bakeryId: number }) =>
            bakeryDetailApi.getBakeryById(item.bakeryId)
          )
        );
        setBakeries(fullBakeries);
      } catch (error) {
        console.error("베이커리 데이터를 불러오는데 실패했습니다.", error);
      }
    };
    fetchBakeries();
  }, []);

  if (bakeries.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* 헤더 */}
        <div className="px-5 py-4">
          <div className="flex items-center">
            <img src="/src/assets/logo.png" alt="관심가게" className="w-7" />
            <span className="ml-2 text-[#FC973B] font-bold">관심가게</span>
          </div>
        </div>

        {/* 빈 상태 메시지 */}
        <div className="flex flex-col items-center justify-center px-5 mt-32">
          <h2 className="text-lg font-bold mb-3">
            아직 관심가게가 등록되지 않았어요
          </h2>
          <p className="text-sm text-gray-500 text-center leading-relaxed">
            우측 하단의 하트 아이콘을 눌러서
            <br />
            즐겨찾는 가게를 등록할 수 있어요
          </p>
        </div>

        <div className="flex flex-col items-center p-10 flex-1">
          {/* 빵꾸러미 카드 */}
          <div className="mb-10 bg-white rounded-xl shadow-md overflow-hidden w-[400px]">
            <div className="relative h-[160px] bg-[#A9A9A9] rounded-lg">
              <div className="absolute bottom-3 right-3">
                <div className="bg-black bg-opacity-40 rounded-full p-2">
                  <HeartIcon className="w-5 h-5 text-red-500 fill-red-500" />
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
              </div>
              <div className="flex items-center justify-between h-[50px]">
              </div>
            </div>
          </div>

          {/* 빵꾸러미 찾아보기 버튼 */}
          <button 
            onClick={() => navigate('/user')}
            className="w-[200px] py-4 rounded-full bg-[#FC973B] text-white font-bold"
          >
            빵꾸러미 찾아보기
          </button>
        </div>
        <UserBottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      {/* 헤더 */}
      <div className="px-5 py-4">
        <div className="flex items-center">
          <img src="/src/assets/logo.png" alt="관심가게" className="w-7" />
          <span className="ml-2 text-[#FC973B] font-bold">관심가게</span>
        </div>
      </div>

      {/* 관심가게 목록 */}
      <div className="px-5 flex-1">
        <div className="flex flex-col gap-5">
          {bakeries.map(bakery => (
            <div
              key={bakery.bakeryId}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
              onClick={() => handleBakeryClick(bakery.bakeryId)}
            >
              <div className="relative">
                <img 
                  src={bakery.bakeryImageUrl || "/src/assets/logo.png"}
                  alt={bakery.name || ""}
                  className="w-full h-[160px] object-cover" 
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-[#FC973B] text-white text-xs px-2 py-1 rounded-full">
                    NEW
                  </span>
                  <span className="bg-white text-black text-xs px-2 py-1 rounded-full">
                    4개 남음
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <div className="bg-black bg-opacity-40 rounded-full p-2">
                    <HeartIcon className="w-5 h-5 text-red-500 fill-red-500" />
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{bakery.name}</span>
                  <div className="flex items-center gap-0.5 text-[#C0C0C0]">
                    <MapPinIcon className="size-3.5" />
                    <span className="text-sm">{bakery.distance}km</span>
                  </div>
                </div>
                <div className="text-sm text-[#C0C0C0] mt-1">
                  픽업시간 : {bakery.pickupTime?.startTime} ~ {bakery.pickupTime?.endTime}
                </div>
                <div className="flex items-center justify-between mt-2 relative">
                  <div className="flex items-center gap-1">
                    <span className="text-[#FC973B]">
                      <StarIcon className="size-4 solid fill-[#FFB933] stroke-none" />
                    </span>
                    <span className="text-[#787878] font-semibold">{bakery.star}</span>
                    <span className="text-xs text-[#E1E1E1]">({bakery.reviewCnt})</span>
                  </div>
                  <div className="absolute right-0 -top-6">
                    <span className="text-sm text-[#D9D9D9] line-through">
                      {bakery.price?.toLocaleString()}원
                    </span>
                  </div>
                  <div className="absolute right-0 top-0">
                    <span className="text-base font-bold text-xl">
                      {bakery.price?.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <UserBottomNavigation />
    </div>
  );
};


export default FavoriteBakery;