import { Link } from 'react-router-dom';

export function AccountManagement() {
  return (
    <div className="mt-8 px-6">
      <div className="flex items-center justify-center">
        <button 
          onClick={() => {/* 로그아웃 처리 */}}
          className="text-gray-500 text-sm px-4"
        >
          로그아웃
        </button>
        <div className="h-4 w-[1px] bg-gray-300"></div>
        <Link 
          to="/owner/withdrawal"
          className="text-gray-400 text-sm px-4"
        >
          회원탈퇴
        </Link>
      </div>
    </div>
  );
}