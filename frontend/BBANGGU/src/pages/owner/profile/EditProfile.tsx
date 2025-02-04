import { Header } from '../../../components/owner/editprofile/Header';
import { ProfileForm } from '../../../components/owner/editprofile/ProfileForm';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';

function EditProfile() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <Header />
      <ProfileForm />
      <BottomNavigation />
    </div>
  );
}

export default EditProfile;