import React, { useState, useEffect } from 'react';
import { BreadPackageHeader } from './components/BreadPackageHeader';
import { BreadPackageInfo } from './components/BreadPackageInfo';
import { ReviewSection } from './components/ReviewSection';
import { CustomerList } from './components/CustomerList';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { BreadPackage, getBakeryPackages } from '../../../api/owner/package';  // 공통 인터페이스 import

// 인터페이스 정의
interface ReservationInfo {
  reservationId: number;
  name: string;
  profileImageUrl: string | null;
  phone: string;
  paymentTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'EXPIRED' | 'COMPLETED';
  quantitiy: number;  // API 응답의 철자 그대로 유지
}

const OwnerMainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'package' | 'review'>('package');
  const [packages, setPackages] = useState<BreadPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<ReservationInfo[]>([]);
  const [isTokenReady, setIsTokenReady] = useState(false);  // 토큰 준비 상태 추가
  const navigate = useNavigate();

  const reviewData = {
    stats: {
      average: 5.0,
      total: 125,
      distribution: {
        5: 1232,
        4: 13,
        3: 2,
        2: 1,
        1: 3
      }
    },
    reviews: [
      {
        id: 1,
        userName: "하얀",
        rating: 5,
        content: "매번 맛나게 먹고있습니다 정말좋습니다!!",
        date: "47분전",
        imageUrl: "/path/to/image.jpg"
      },
    ]
  };

  // TODO: 실제 bakeryId는 로그인 정보에서 가져와야 함
  const bakeryId = 1; // 현재 토큰의 sub 값이 19입니다

  // 토큰 준비 상태 체크
  useEffect(() => {
    if (import.meta.env.VITE_USER_TOKEN) {
      setIsTokenReady(true);
    }
  }, []);

  // 데이터 로딩
  useEffect(() => {
    if (!isTokenReady) return;  // 토큰이 준비되지 않았으면 리턴

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getBakeryPackages(bakeryId);
        
        if (response.data) {
          setPackages([response.data]);
        }
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
        setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
        setPackages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [bakeryId, isTokenReady]);  // isTokenReady 의존성 추가

  const handleTabChange = (tab: 'package' | 'review') => {
    setActiveTab(tab);
  };

  // CustomerList의 예약 데이터를 상위 컴포넌트로 끌어올림
  const handleReservationsUpdate = (newReservations: ReservationInfo[]) => {
    setReservations(newReservations);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FC973B] mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-800 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#FC973B] text-white rounded-lg hover:bg-[#e88a34]"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="p-4">
        {/* 기존 빵꾸러미 정보 */}
        <BreadPackageHeader hasPackage={packages.length > 0} />
        <div className="flex mb-6">
          <div className="flex flex-1 mx-1 border-b">
            <button 
              className={`flex-1 py-2 ${
                activeTab === 'package' 
                  ? 'border-b-2 border-[#FC973B] text-[#333333] font-bold'
                  : 'text-gray-400'
              }`}
              onClick={() => handleTabChange('package')}
            >
              빵꾸러미
            </button>
            <button 
              className={`flex-1 py-2 ${
                activeTab === 'review'
                  ? 'border-b-2 border-[#FC973B] text-[#333333] font-bold'
                  : 'text-gray-400'
              }`}
              onClick={() => handleTabChange('review')}
            >
              리뷰
            </button>
          </div>
        </div>
        {activeTab === 'package' ? (
          <>
            <BreadPackageInfo 
              currentPackage={packages[0]}
              reservations={reservations}
              onPackageDeleted={() => {}}
            />
            <div className="mb-6">
              <button
                onClick={() => navigate('/owner/bread/register')}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-[#FFF9F5] to-[#FFF5EC] text-[#FC973B] rounded-xl hover:shadow-md transition-all border border-[#FC973B]/10"
              >
                <div className="flex items-center gap-2">
                  <BuildingStorefrontIcon className="w-5 h-5" />
                </div>
                <span className="font-medium">우리가게 빵 등록하기</span>
              </button>
            </div>
            <CustomerList 
              bakeryId={bakeryId}
              onReservationsUpdate={handleReservationsUpdate}
            />
          </>
        ) : (
          <ReviewSection 
            stats={reviewData.stats}
            reviews={reviewData.reviews}
          />
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default OwnerMainPage;