import React, { useState, useEffect } from 'react';
import { BreadPackageHeader } from './components/BreadPackageHeader';
import { BreadPackageInfo } from './components/BreadPackageInfo';
import { ReviewSection } from './components/ReviewSection';
import { CustomerList } from './components/CustomerList';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { BreadPackage, getBakeryPackages } from '../../../api/owner/package';  // 공통 인터페이스 import
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { logout } from '../../../store/slices/authSlice';
import { clearUserInfo } from '../../../store/slices/userSlice';
import { getUserInfo } from '../../../api/user/user';
import breadPackageIcon from '../../../assets/images/bakery/빵꾸러미.png';

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
  const [activeTab, setActiveTab] = useState<'package' | 'review'>('package');
  const [packages, setPackages] = useState<BreadPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bakeryId, setBakeryId] = useState<number | null>(null);
  const [reservations, setReservations] = useState<ReservationInfo[]>([]);
  
  // auth 상태와 userInfo 상태 모두 가져오기
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // 점주 권한 체크 및 유저 정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        const data = await getUserInfo();
        
        // 점주가 아닌 경우 메인으로 리다이렉트
        if (data.role !== 'OWNER') {
          dispatch(logout());
          dispatch(clearUserInfo());
          navigate('/');
          return;
        }

        setBakeryId(data.userId);
      } catch (error) {
        console.error('Error fetching user info:', error);
        dispatch(logout());
        dispatch(clearUserInfo());
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [dispatch, navigate, accessToken]);

  // 빵꾸러미 조회
  useEffect(() => {
    const fetchData = async () => {
      if (!bakeryId) return;

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getBakeryPackages(bakeryId);
        
        if (response.data && response.data.packageId !== null) {
          setPackages([response.data]);
        } else {
          setPackages([]); // packageId가 null인 경우 빈 배열로 설정
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
  }, [bakeryId]);

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
            {packages.length > 0 ? (
              <BreadPackageInfo 
                currentPackage={packages[0]}
                reservations={reservations}
                onPackageDeleted={() => {
                  setPackages([]);
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
              bakeryId={bakeryId || 0}
              onReservationsUpdate={handleReservationsUpdate}
            />
          </>
        ) : (
          <ReviewSection 
            bakeryId={bakeryId || 0}
          />
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default OwnerMainPage;