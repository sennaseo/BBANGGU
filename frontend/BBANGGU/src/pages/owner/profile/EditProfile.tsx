import { useState } from 'react';
import { IoArrowBack, IoEyeOutline } from 'react-icons/io5';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';

function EditProfile() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleBack = () => {
    // 뒤로가기 처리
    console.log('뒤로가기');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 제출 처리
    console.log('폼 제출');
  };

  return (
    <div className="min-h-screen bg-white px-4 pb-20">
      {/* 헤더 */}
      <div className="flex items-center h-14">
        <button onClick={handleBack} className="p-2">
          <IoArrowBack className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium ml-2">회원정보수정</h1>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이름 입력 */}
        <div className="space-y-2">
          <label className="block text-sm">이름</label>
          <input
            type="text"
            placeholder="서유민"
            className="w-full px-4 py-3 rounded-lg border border-gray-200"
          />
        </div>

        {/* 이메일 입력 */}
        <div className="space-y-2">
          <label className="block text-sm">Email</label>
          <input
            type="email"
            placeholder="dmsckd312@gmail.com"
            className="w-full px-4 py-3 rounded-lg border border-gray-200"
          />
        </div>

        {/* 전화번호 입력 */}
        <div className="space-y-2">
          <label className="block text-sm">전화번호</label>
          <input
            type="tel"
            placeholder="010-1234-1234"
            className="w-full px-4 py-3 rounded-lg border border-gray-200"
          />
        </div>

        {/* 프로필 사진 */}
        <div className="space-y-2">
          <label className="block text-sm">프로필 사진</label>
          <button type="button" className="w-full h-[100px] border border-gray-200 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* 비밀번호 변경 섹션 */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium">비밀번호 변경</h2>
          
          {/* 현재 비밀번호 */}
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="현재 비밀번호 입력"
              className="w-full px-4 py-3 rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <IoEyeOutline className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* 새 비밀번호 */}
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="새 비밀번호 입력"
              className="w-full px-4 py-3 rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <IoEyeOutline className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* 저장 버튼 */}
        <button
          type="submit"
          className="w-full bg-[#FF9B50] text-white py-4 rounded-lg mt-8"
        >
          저장하기
        </button>
      </form>

      {/* 네비게이션 바 추가 */}
      <BottomNavigation />
    </div>
  );
}

export default EditProfile;