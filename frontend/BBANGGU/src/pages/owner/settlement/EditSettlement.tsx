import { useState, useRef } from 'react';
import { Header } from '../../../components/owner/editprofile/Header';
import { SubmitButton } from '../../../common/form/SubmitButton';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';
import { IoTrashOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

function EditSettlement() {
  const [businessLicense, setBusinessLicense] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
        setBusinessLicense(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setBusinessLicense(null);
  };

  const inputClassName = "w-full px-4 py-3 rounded-[8px] border border-[#EFEFEF] placeholder-[#8E8E8E] focus:outline-none focus:border-[#FF9B50]";

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header title="정산 정보 수정" />
      
      <form onSubmit={handleSubmit} className="space-y-6 p-4">
        {/* 안내 텍스트 */}
        <p className="text-[#8E8E8E] text-sm">
          판매 대금 정산을 위해 모든 항목을 입력해주세요.
        </p>

        {/* 가게 이름 */}
        <div className="space-y-2">
          <label className="block text-sm">
            가게 이름
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            placeholder="파리바게트 인동점"
            className={inputClassName}
          />
        </div>

        {/* 예금주명 */}
        <div className="space-y-2">
          <label className="block text-sm">
            예금주명
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            placeholder="중국인러마"
            className={inputClassName}
          />
        </div>

        {/* 사업자 계좌번호 */}
        <div className="space-y-2">
          <label className="block text-sm">
            사업자 계좌번호
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            placeholder="127-01-010112"
            className={inputClassName}
          />
        </div>

        {/* 세금계산서 발급용 이메일 */}
        <div className="space-y-2">
          <label className="block text-sm">
            세금계산서 발급용 이메일
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="email"
            placeholder="kky3652@naver.com"
            className={inputClassName}
          />
        </div>

        {/* 사업자등록증 사본 */}
        <div className="space-y-2">
          <label className="block text-sm">
            사업자등록증 사본
            <span className="text-red-500 ml-1">*</span>
          </label>
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
              className={`${inputClassName} h-[120px] flex items-center justify-center`}
            >
              {businessLicense ? (
                <img
                  src={businessLicense}
                  alt="사업자등록증 미리보기"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-[#8E8E8E]">터치하여 업로드</span>
              )}
            </button>
            {businessLicense && (
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

        <SubmitButton
          text="수정"
          className="mt-8"
        />
      </form>

      <BottomNavigation />
    </div>
  );
}

export default EditSettlement;