import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';
import { PageHeader } from '../../../components/owner/mypage/PageHeader';
import { ProfileSection } from '../../../components/owner/mypage/ProfileSection';
import { MenuList } from '../../../components/owner/mypage/MenuList';
import { CustomerSupport } from '../../../components/owner/mypage/CustomerSupport';
import { AccountManagement } from '../../../components/owner/mypage/AccountMagagement';
import { RootState } from '../../../store';
import { logout } from '../../../store/slices/authSlice';
import { setUserInfo, clearUserInfo } from '../../../store/slices/userSlice';
import { getUserInfo } from '../../../api/user/user';

type UserRole = 'OWNER' | 'USER';

function MyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        const data = await getUserInfo();
        dispatch(setUserInfo({
          name: data.name,
          profileImageUrl: data.profileImageUrl,
          email: data.email,
          phone: data.phone,
          userId: data.userId,
          role: data.role as UserRole,
          addressRoad: data.addressRoad,
          addressDetail: data.addressDetail
        }));
      } catch (error) {
        console.error('Error fetching user info:', error);
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [dispatch, navigate, accessToken]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUserInfo());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader />
      <ProfileSection userInfo={{
        name: userInfo?.name || '',
        profilePhotoUrl: userInfo?.profileImageUrl || null,
        email: userInfo?.email,
        phone: userInfo?.phone
      }} />
      <MenuList />
      <CustomerSupport />
      <AccountManagement onLogout={handleLogout} />
      <BottomNavigation />
    </div>
  );
}

export default MyPage;
