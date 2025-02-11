import { Link, useNavigate } from 'react-router-dom';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';
import defaultProfile from '@/assets/default-profile.jpg';
import pickupTimeIcon from '@/assets/icons/pickup-time-icon.svg';
import settlementIcon from '@/assets/icons/settlement-icon.svg';
import qnaIcon from '@/assets/icons/qna-icon.svg';
import supportIcon from '@/assets/icons/support-icon.svg';
import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUserInfo } from '../../../api/common/user';

function MyPage() {
  const [userInfo, setUserInfo] = useState<{
    name: string;
    profilePhotoUrl: string | null;
  }>({
    name: '',
    profilePhotoUrl: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = 109; // 임시로 하드코딩
        const data = await getUserInfo(userId);
        console.log('Received user data:', data); // 데이터 확인용
        setUserInfo({
          name: data.name,
          profilePhotoUrl: data.profilePhotoUrl
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
        // 에러 메시지 표시 또는 로그인 페이지로 리다이렉트
        if (error instanceof Error && error.message === '로그인이 필요합니다.') {
          // TODO: 로그인 페이지로 리다이렉트
          navigate('/login');
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleLogout = () => {
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('accessToken');
    // 로그인 페이지로 리다이렉트
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 헤더 */}
      <div className="flex justify-between items-center px-6 h-14">
        <h1 className="text-lg font-medium">마이페이지</h1>
        <button className="p-2">
          <Bell className="w-6 h-6" />
        </button>
      </div>

      {/* 프로필 섹션부터 시작 */}
      <div className="px-6 py-6">
        <div className="flex items-center space-x-4">
          <img
            src={userInfo.profilePhotoUrl ? userInfo.profilePhotoUrl : defaultProfile}
            alt="프로필"
            className="w-[60px] h-[60px] rounded-full object-cover bg-gray-100"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultProfile;
            }}
          />
          <div>
            <h2 className="text-lg font-semibold">
              {userInfo.name}
              <span className="text-gray-600 font-normal ml-1">사장님</span>
            </h2>
            <p className="text-gray-600 text-sm">오늘도 빵과 함께 할기찬 하루 보내세요~</p>
          </div>
        </div>

        {/* 프로필 수정 버튼들 */}
        <div className="flex gap-3 mt-4">
          <Link 
            to="/owner/profile/edit"
            className="flex-1 py-2.5 text-center rounded-xl bg-[#FF9B50] text-white font-medium"
          >
            회원 정보 수정
          </Link>
          <Link 
            to="/owner/store/edit"
            className="flex-1 py-2.5 text-center rounded-xl border border-[#FF9B50] text-[#FF9B50] font-medium"
          >
            가게 정보 수정
          </Link>
        </div>
      </div>

      {/* 메뉴 리스트 */}
      <div className="px-6 space-y-3">
        {/* 픽업 시간 설정 */}
        <Link 
          to="/owner/pickup-time"
          className="flex items-center justify-between p-4 rounded-2xl border border-[#D9D9D9] bg-[#F2F2F2]"
        >
          <span className="text-gray-900 font-medium">픽업 시간 설정</span>
          <img src={pickupTimeIcon} alt="픽업 시간" className="w-5 h-5" />
        </Link>

        {/* 거래 및 정산 */}
        <Link 
          to="/owner/settlement/edit"
          className="flex items-center justify-between p-4 rounded-2xl border border-[#D9D9D9] bg-[#F2F2F2]"
        >
          <span className="text-gray-900 font-medium">거래 및 정산</span>
          <img src={settlementIcon} alt="거래 및 정산" className="w-6 h-6" />
        </Link>
      </div>

      {/* 고객 지원 서비스 */}
      <div className="mt-3 px-6">
        <h3 className="text-sm text-gray-600 mb-3">고객 지원 서비스</h3>
        <div className="flex justify-center gap-3">
          <Link 
            to="/owner/qna"
            className="flex flex-col items-center justify-center w-[190px] h-[180px] bg-white rounded-[10px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.15)]"
          >
            <img src={qnaIcon} alt="Q&A" className="w-14 h-14 mb-2" />
            <span className="text-gray-900">Q&A</span>
          </Link>
          <Link 
            to="/owner/chatbot"
            className="flex flex-col items-center justify-center w-[190px] h-[180px] bg-white rounded-[10px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.15)]"
          >
            <img src={supportIcon} alt="고객센터" className="w-14 h-14 mb-2" />
            <span className="text-gray-900">고객센터</span>
          </Link>
        </div>
      </div>

      {/* 계정 관리 텍스트 링크 */}
      <div className="mt-8 px-6">
        <div className="flex items-center justify-center">
          <button 
            onClick={handleLogout}
            className="text-gray-500 text-sm px-4"
          >
            로그아웃
          </button>
          <div className="h-4 w-[1px] bg-gray-300"></div> {/* 구분선 */}
          <Link 
            to="/owner/withdrawal"
            className="text-gray-400 text-sm px-4"
          >
            회원탈퇴
          </Link>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}

export default MyPage;
