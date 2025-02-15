import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, MapIcon, HeartIcon, UserIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, MapIcon as MapIconSolid, HeartIcon as HeartIconSolid, UserIcon as UserIconSolid } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'

export default function UserBottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const userInfo = useSelector((state: RootState) => state.user.userInfo)

  const navigationItems = [
    {
      label: '홈',
      path: '/user',
      icon: currentPath === '/user' ? <HomeIconSolid className="w-6 h-6" /> : <HomeIcon className="w-6 h-6" />,
    },
    {
      label: '지도',
      path: '/user/map',
      icon: currentPath === '/user/map' ? <MapIconSolid className="w-6 h-6" /> : <MapIcon className="w-6 h-6" />,
    },
    {
      label: '관심',
      path: `/user/${userInfo?.userId}/favorite`,
      icon: currentPath === `/user/${userInfo?.userId}/favorite` ? <HeartIconSolid className="w-6 h-6" /> : <HeartIcon className="w-6 h-6" />,
    },
    {
      label: '마이',
      path: `/user/${userInfo?.userId}/mypage`,
      icon: currentPath === `/user/${userInfo?.userId}/mypage` ? <UserIconSolid className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-white border-t max-w-[440px] w-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="flex justify-around items-center h-16">
          {navigationItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center"
            >
              <div className={`${currentPath === item.path ? 'text-[#FC973B]' : 'text-gray-400'}`}>
                {item.icon}
              </div>
              <span 
                className={`mt-1 text-xs ${
                  currentPath === item.path ? 'text-[#FC973B] font-medium' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
