import { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';

function EditStore() {
  const handleBack = () => {
    window.history.back();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('폼 제출');
  };

  return (
    <div className="min-h-screen bg-white px-4 pb-20">
      {/* 헤더 */}
      <div className="flex items-center h-14">
        <button onClick={handleBack} className="p-2">
          <IoArrowBack className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium ml-2">가게정보 수정</h1>
      </div>

      {/* 안내 텍스트 */}
      <p className="text-gray-600 mt-4 mb-6">
        입력하신 내용은 언제든지 변경 가능해요.
      </p>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 가게 이름 */}
        <div className="space-y-2">
          <label className="block text-sm">가게 이름</label>
          <input
            type="text"
            placeholder="가롯빵집"
            className="w-full px-4 py-3 rounded-lg border border-gray-200"
          />
        </div>

        {/* 가게 주소 */}
        <div className="space-y-2">
          <label className="block text-sm">가게 주소</label>
          <input
            type="text"
            placeholder="진평동 453"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 mb-2"
          />
          <input
            type="text"
            placeholder="타워티 305호"
            className="w-full px-4 py-3 rounded-lg border border-gray-200"
          />
        </div>

        {/* 가게 사진 */}
        <div className="space-y-2">
          <label className="block text-sm">가게 사진</label>
          <div className="w-full h-[120px] border border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
            터치하여 업로드
          </div>
        </div>

        {/* 저장 버튼 */}
        <button
          type="submit"
          className="w-full bg-[#FF9B50] text-white py-4 rounded-lg mt-8"
        >
          수정
        </button>
      </form>

      <BottomNavigation />
    </div>
  );
}

export default EditStore;