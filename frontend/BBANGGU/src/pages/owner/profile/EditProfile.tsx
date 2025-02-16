import { useLocation } from 'react-router-dom';
import { Header } from '../../../components/owner/editprofile/Header';
import { ProfileForm } from '../../../components/owner/editprofile/ProfileForm';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';
import { ProfileSectionProps } from '../../../types/owner';

type UserInfo = ProfileSectionProps['userInfo'];

function EditProfile() {
  const location = useLocation();
  const userInfo = location.state?.userInfo as UserInfo;

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header title="회원정보수정" />
      <ProfileForm userInfo={userInfo} />
      <BottomNavigation />
    </div>
  );
}

export default EditProfile;
