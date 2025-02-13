import React, { useState, useEffect } from 'react';
import { useCustomerSort } from '../../../hooks/owner/useCustomerSort';
import { BreadPackageHeader } from './components/BreadPackageHeader';
import { BreadPackageInfo } from './components/BreadPackageInfo';
import { ReviewSection } from './components/ReviewSection';
import { CustomerList } from './components/CustomerList';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';
import { getBakeryPackages } from '../../../api/owner/package';
import { PackageType } from '../../../types/bakery';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface Customer {
  id: number;
  name: string;
  email: string;
  paymentTime: string;
  isPickedUp: boolean;
  breadCount: number;
}

const OwnerMainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'package' | 'review'>('package');
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasBreadRegistered, setHasBreadRegistered] = useState(false);
  const navigate = useNavigate();

  const initialCustomers: Customer[] = [
    { id: 1, name: '서유민', email: 'youmin77@naver.com', paymentTime: '19:15', isPickedUp: false, breadCount: 1 },
    { id: 2, name: '신은찬', email: 'youmin77@naver.com', paymentTime: '19:20', isPickedUp: false, breadCount: 1 },
    { id: 3, name: '김유진', email: 'youmin77@naver.com', paymentTime: '19:25', isPickedUp: false, breadCount: 1 },
    { id: 4, name: '정나금', email: 'youmin77@naver.com', paymentTime: '19:30', isPickedUp: false, breadCount: 1 },
    { id: 5, name: '정나금', email: 'youmin77@naver.com', paymentTime: '19:35', isPickedUp: false, breadCount: 1 },
    { id: 6, name: '김휘동', email: 'youmin77@naver.com', paymentTime: '19:40', isPickedUp: false, breadCount: 1 },
  ];

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

  const { 
    customers, 
    sortByPaymentTime, 
    togglePickup, 
    handleSort 
  } = useCustomerSort(initialCustomers);

  // TODO: 실제 bakeryId는 로그인 정보에서 가져와야 함
  const bakeryId = 1; // 현재 토큰의 sub 값이 19입니다

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        console.log('패키지 조회 시작 - bakeryId:', bakeryId);
        const data = await getBakeryPackages(bakeryId);
        console.log('조회된 패키지:', data);
        
        // 데이터가 배열인지 확인
        if (Array.isArray(data)) {
          setPackages(data);
          setHasBreadRegistered(data.length > 0);
        } else {
          console.error('잘못된 데이터 형식:', data);
          setPackages([]);
          setHasBreadRegistered(false);
        }
      } catch (err) {
        console.error('패키지 조회 실패:', err);
        setPackages([]);
        setHasBreadRegistered(false);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, [bakeryId]);

  const handleTabChange = (tab: 'package' | 'review') => {
    setActiveTab(tab);
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
        <BreadPackageHeader />
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
            <BreadPackageInfo packages={packages} />
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
              customers={customers}
              sortByPaymentTime={sortByPaymentTime}
              onTogglePickup={togglePickup}
              onSort={handleSort}
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