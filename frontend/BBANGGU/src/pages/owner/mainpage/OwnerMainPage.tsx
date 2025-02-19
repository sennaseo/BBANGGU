import React, { useState, useEffect } from 'react';
import { BreadPackageHeader } from './components/BreadPackageHeader';
import { BreadPackageInfo } from './components/BreadPackageInfo';
import { ReviewSection } from './components/ReviewSection';
import { CustomerList } from './components/CustomerList';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { BreadPackage, getBakeryPackages } from '../../../api/owner/package';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/authSlice';
import { clearUserInfo } from '../../../store/slices/userSlice';
import { getUserInfo } from '../../../api/user/user';
import breadPackageIcon from '../../../../dist/bakery/빵꾸러미.png';
import { getBakeryByOwner } from '../../../api/owner/bakery';

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPackage, setCurrentPackage] = useState<BreadPackage | null>(null);
  const [activeTab, setActiveTab] = useState<'package' | 'review'>('package');
  const [reservations, setReservations] = useState<ReservationInfo[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 1. 사용자 정보 확인
        const userData = await getUserInfo();
        if (userData.role !== 'OWNER') {
          dispatch(logout());
          dispatch(clearUserInfo());
          navigate('/');
          return;
        }

        // 2. 베이커리 정보 가져오기
        const bakeryData = await getBakeryByOwner();
        console.log('베이커리 정보:', bakeryData);
        
        // 3. 오늘의 빵꾸러미 정보 가져오기
        try {
          const packageResponse = await getBakeryPackages(bakeryData.bakeryId);
          console.log('빵꾸러미 조회 결과:', packageResponse);
          
          if (packageResponse && packageResponse.data && packageResponse.data.length > 0) {
            console.log('빵꾸러미 데이터:', packageResponse.data[0]);  // 첫 번째 빵꾸러미 사용
            setCurrentPackage(packageResponse.data[0]);
          } else {
            console.log('빵꾸러미 없음');
            setCurrentPackage(null);
          }
        } catch (error) {
          console.error('빵꾸러미 조회 실패:', error);
          setCurrentPackage(null);
        }

      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, navigate]);

  const handleTabChange = (tab: 'package' | 'review') => {
    setActiveTab(tab);
  };

  // CustomerList의 예약 데이터를 상위 컴포넌트로 끌어올림
  const handleReservationsUpdate = (newReservations: ReservationInfo[]) => {
    setReservations(newReservations);
  };

  if (isLoading && !currentPackage) {
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
        <BreadPackageHeader hasPackage={currentPackage !== null} />
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
            {currentPackage ? (
              <BreadPackageInfo 
                currentPackage={currentPackage}
                reservations={reservations}
                onPackageDeleted={() => {
                  if (currentPackage.bakeryId) {
                    getBakeryPackages(currentPackage.bakeryId)
                      .then(response => setCurrentPackage(response.data[0]))
                      .catch(console.error);
                  }
                }}
              />
            ) : (
              // 빵꾸러미가 없을 때 보여줄 빈 상태 화면
              <div className="bg-white rounded-[20px] border border-gray-100 p-8 mb-6 flex flex-col items-center">
                <div className="w-16 h-16 mb-4">
                  <img 
                    src={breadPackageIcon} 
                    alt="빵꾸러미" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-[20px] font-bold text-[#242424] mb-2">
                  등록된 빵꾸러미가 없습니다
                </h3>
                <p className="text-gray-500 mb-6">
                  새로운 빵꾸러미를 등록해보세요!
                </p>
                <button
                  onClick={() => navigate('/owner/package/guide')}
                  className="px-6 py-3 bg-[#FC973B] text-white rounded-full font-medium hover:bg-[#e88a34] transition-colors"
                >
                  빵꾸러미 등록하기
                </button>
              </div>
            )}
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
              bakeryId={currentPackage?.bakeryId || 0}
              onReservationsUpdate={handleReservationsUpdate}
            />
          </>
        ) : (
          <ReviewSection 
            bakeryId={currentPackage?.bakeryId || 0}
          />
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default OwnerMainPage;