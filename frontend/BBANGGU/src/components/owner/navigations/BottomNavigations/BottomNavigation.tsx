import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, Store } from 'lucide-react';

function BottomNavigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    // console.log('Current path:', location.pathname); // 현재 경로 확인용
    
    if (path === '/owner/mypage') {
      return (
        location.pathname === '/owner/mypage' ||
        location.pathname === '/owner/store/edit' ||
        location.pathname === '/owner/pickup-time' ||
        location.pathname === '/owner/chatbot' ||
        location.pathname === '/owner/profile/edit' ||
        location.pathname === '/owner/settlement/edit'
      );
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {/* 내 가게 */}
        <Link 
          to="/owner/store" 
          className={`flex flex-col items-center space-y-1 w-1/3 ${
            isActive('/owner/store') ? 'text-[#FC973B]' : 'text-gray-400'
          }`}
        >
          <Store className="w-6 h-6" />
          <span className="text-xs">내 가게</span>
        </Link>

        {/* 분석 */}
        <Link 
          to="/owner/analysis" 
          className={`flex flex-col items-center space-y-1 w-1/3 ${
            isActive('/owner/analysis') ? 'text-[#FC973B]' : 'text-gray-400'
          }`}
        >
          <ClipboardList className="w-6 h-6" />
          <span className="text-xs">분석</span>
        </Link>

        {/* 마이 */}
        <Link 
          to="/owner/mypage" 
          className={`flex flex-col items-center space-y-1 w-1/3 ${
            isActive('/owner/mypage') ? 'text-[#FC973B]' : 'text-gray-400'
          }`}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs">마이</span>
        </Link>
      </div>
    </nav>
  );
}

export default BottomNavigation;
