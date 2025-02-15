import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserInfo } from '../../../api/user/user';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';
import { PageHeader } from '../../../components/owner/mypage/PageHeader';
import { ProfileSection } from '../../../components/owner/mypage/ProfileSection';
import { MenuList } from '../../../components/owner/mypage/MenuList';
import { CustomerSupport } from '../../../components/owner/mypage/CustomerSupport';
import { AccountManagement } from '../../../components/owner/mypage/AccountMagagement';

function MyPage() {
  const [userInfo, setUserInfo] = useState<{
    name: string;
    profilePhotoUrl: string | null;
    email?: string;
    phone?: string;
  }>({
    name: '',
    profilePhotoUrl: null,
    email: '',
    phone: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        console.log('API 응답 데이터:', data);
        setUserInfo({
          name: data.name,
          profilePhotoUrl: data.profileImageUrl,
          email: data.email,
          phone: data.phone
        });
        console.log('현재 userInfo 상태:', {
          name: data.name,
          profilePhotoUrl: data.profileImageUrl,
          email: data.email,
          phone: data.phone
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
        if (error instanceof Error && error.message === '로그인이 필요합니다.') {
          // navigate('/login');
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader />
      <ProfileSection userInfo={userInfo} />
      <MenuList />
      <CustomerSupport />
      <AccountManagement onLogout={handleLogout} />
      <BottomNavigation />
    </div>
  );
}

export default MyPage;
