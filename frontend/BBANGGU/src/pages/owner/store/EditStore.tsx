import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../../components/owner/editprofile/Header';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';
import { SubmitButton } from '../../../common/form/SubmitButton';
import { IoTrashOutline } from 'react-icons/io5';

function EditStore() {
  const navigate = useNavigate();
  const [storeImage, setStoreImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 나중에 여기에 API 호출 로직이 들어갈 예정
    navigate('/owner/mypage');
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setStoreImage(null);
  };

  const handleProfileImageClick = () => {
    profileImageRef.current?.click();
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProfileImage = () => {
    setProfileImage(null);
  };

  const inputClassName = "w-full px-4 py-3 rounded-[8px] border border-[#EFEFEF] placeholder-[#8E8E8E] focus:outline-none focus:border-[#FF9B50]";

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header title="가게정보 수정" />
      
      <form onSubmit={handleSubmit} className="space-y-6 p-4">
        {/* 가게 이름 */}
        <div className="space-y-2">
          <label className="block text-sm">
            가게 이름
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            placeholder="가롯빵집"
            className={inputClassName}
          />
        </div>

        {/* 가게 설명 */}
        <div className="space-y-2">
          <label className="block text-sm">
            가게 설명
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            placeholder="예) 20년 경력의 베이커리 장인이 만드는 건강한 빵집입니다.&#13;&#10;당일 생산 당일 판매를 원칙으로 하며, 대표 메뉴는 크로와상과 통밀식빵입니다.&#13;&#10;글루텐프리 빵도 준비되어 있습니다."
            className={`${inputClassName} h-24 resize-none`}
          />
        </div>

        {/* 가게 주소 */}
        <div className="space-y-2">
          <label className="block text-sm">
            가게 주소
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="진평동 453"
              className={inputClassName}
            />
            <input
              type="text"
              placeholder="타워티 305호"
              className={inputClassName}
            />
          </div>
        </div>

        {/* 가게 사진 */}
        <div className="space-y-6">
          {/* 가게 프로필 이미지 */}
          <div className="space-y-2">
            <label className="block text-sm">
              가게 프로필 이미지
              <span className="text-red-500 ml-1">*</span>
            </label>
            <p className="text-xs text-[#8E8E8E]">메인 화면에 표시될 가게 프로필 이미지나 대표 상품 이미지를 등록해주세요.</p>
            <input
              type="file"
              ref={profileImageRef}
              onChange={handleProfileImageChange}
              accept="image/*"
              className="hidden"
            />
            <div className="flex justify-center">
              <div className="relative">
                <button 
                  type="button" 
                  onClick={handleProfileImageClick}
                  className="w-[120px] h-[120px] border border-[#EFEFEF] rounded-[8px] flex items-center justify-center overflow-hidden"
                >
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="가게 프로필 이미지 미리보기" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-6 h-6 text-[#8E8E8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
                {profileImage && (
                  <button
                    type="button"
                    onClick={handleDeleteProfileImage}
                    className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                  >
                    <IoTrashOutline className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 가게 대표 이미지 */}
          <div className="space-y-2">
            <label className="block text-sm">
              가게 대표 이미지
              <span className="text-red-500 ml-1">*</span>
            </label>
            <p className="text-xs text-[#8E8E8E]">가게 상세 페이지 상단에 표시될 대표 메뉴나 매장 전경 이미지를 등록해주세요.</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div className="relative">
              <button 
                type="button" 
                onClick={handleImageClick}
                className="w-full h-[200px] border border-[#EFEFEF] rounded-[8px] flex items-center justify-center overflow-hidden"
              >
                {storeImage ? (
                  <img 
                    src={storeImage} 
                    alt="가게 대표 이미지 미리보기" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-6 h-6 text-[#8E8E8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              {storeImage && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                >
                  <IoTrashOutline className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <SubmitButton
          text="수정"
          className="mt-8"
        />
      </form>

      <BottomNavigation />
    </div>
  );
}

export default EditStore;