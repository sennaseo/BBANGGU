import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../../components/owner/editprofile/Header';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';
import { SubmitButton } from '../../../common/form/SubmitButton';
import { IoTrashOutline } from 'react-icons/io5';
import { getBakeryByUserId, updateBakery, UpdateBakeryRequest } from '../../../api/bakery/bakery';

interface BakeryInfo {
  bakeryId: number;
  name: string;
  description: string;
  addressRoad: string;
  addressDetail: string;
  bakeryImageUrl: string | null;
  bakeryBackgroundImgUrl: string | null;
}

export function EditStore() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);
  const [bakeryInfo, setBakeryInfo] = useState<BakeryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 폼 데이터 상태 추가
  const [formData, setFormData] = useState<BakeryInfo>({
    bakeryId: 0,
    name: '',
    description: '',
    addressRoad: '',
    addressDetail: '',
    bakeryImageUrl: null,
    bakeryBackgroundImgUrl: null,
  });

  useEffect(() => {
    const fetchBakeryInfo = async () => {
      try {
        const data = await getBakeryByUserId();
        setBakeryInfo(data);
        console.log(data);
        // 가게 정보를 폼 데이터에 설정
        if (data) {
          if (data) {
            setFormData({
              bakeryId: data.bakeryId,
              name: data.name,
              description: data.description,
              addressRoad: data.addressRoad,
              addressDetail: data.addressDetail,
              bakeryImageUrl: data.bakeryImageUrl || null,
              bakeryBackgroundImgUrl: data.bakeryBackgroundImgUrl || null
            });
          }
        }

      } catch (error) {
        console.error('가게 정보 조회 실패:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('가게 정보를 불러오는데 실패했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBakeryInfo();
  }, []);

  // 입력 핸들러 추가
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!bakeryInfo) {
      alert('가게 정보를 찾을 수 없습니다.');
      return;
    }
  
    // 필수 입력값 검증
    if (!formData.name.trim()) {
      alert('가게 이름을 입력해주세요.');
      return;
    }
    if (!formData.description.trim()) {
      alert('가게 설명을 입력해주세요.');
      return;
    }
    if (!formData.addressRoad.trim()) {
      alert('도로명 주소를 입력해주세요.');
      return;
    }
    if (!formData.addressDetail.trim()) {
      alert('상세 주소를 입력해주세요.');
      return;
    }
  
    try {

      console.log("🖼️ 폼 데이터:", formData);
      // 가게 프로필 이미지 파일
      let profileImageFile: File | undefined = undefined;
  
      if (formData.bakeryImageUrl && typeof formData.bakeryImageUrl === "string") {
          const res = await fetch(formData.bakeryImageUrl);
          const blob = await res.blob();
          profileImageFile = new File([blob], `profile.${blob.type.split("/")[1] || "jpg"}`, { type: blob.type })
      }
  
      // 가게 배경사진 파일
      let bakeryBackgroundImgFile: File | undefined = undefined;
  
      if (formData.bakeryBackgroundImgUrl && typeof formData.bakeryBackgroundImgUrl === "string") {
          const res = await fetch(formData.bakeryBackgroundImgUrl);
          const blob = await res.blob();
          bakeryBackgroundImgFile = new File([blob], `bakeryBackgroundImg.${blob.type.split("/")[1] || "jpg"}`, { type: blob.type })
      }
  
      // 이미지 파일들이 제대로 변환되었는지 로그로 확인
      console.log('프로필 이미지:', profileImageFile);
      console.log('배경 이미지:', bakeryBackgroundImgFile);
  
      const updateData: UpdateBakeryRequest = {
        name: formData.name,
        description: formData.description,
        addressRoad: formData.addressRoad,
        addressDetail: formData.addressDetail,
      };
  
      await updateBakery(bakeryInfo.bakeryId, updateData, profileImageFile, bakeryBackgroundImgFile);
  
      alert('가게 정보가 성공적으로 수정되었습니다.');
      navigate('/owner/mypage');
    } catch (error) {
      console.error('가게 정보 수정 실패:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('가게 정보 수정에 실패했습니다.');
      }
    }
  };
  // 가게 프로필 이미지 클릭
  const handleProfileImageClick = () => {
    profileImageRef.current?.click();
  };
  
  // 가게 이미지 클릭
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };


  const handleDeleteImage = (name: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [name]: null
    }));
  };
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files, name } = e.target;
    const file = files?.[0];
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
        setFormData(prev => ({
          ...prev,
          [name]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };



  // const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { files, name } = e.target;
  //   const file = files?.[0];
    
  //   if (file) {
  //     if (file.size > 5 * 1024 * 1024) {
  //       alert('파일 크기는 5MB 이하여야 합니다.');
  //       return;
  //     }
  
  //     if (!file.type.startsWith('image/')) {
  //       alert('이미지 파일만 업로드 가능합니다.');
  //       return;
  //     }
  
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setFormData(prev => ({
  //         ...prev,
  //         [name]: reader.result as string  // `name` 속성을 활용해 동적으로 저장
  //       }));
  //     };
  //     reader.readAsDataURL(file);
  
  //     // 미리보기 URL 생성 (Blob URL 활용)
  //     const previewUrl = URL.createObjectURL(file);
  //     console.log("🖼️ 미리보기 URL:", previewUrl);
  //   }
  // };
  
  const inputClassName = "w-full px-4 py-3 rounded-[8px] border border-[#EFEFEF] placeholder-[#8E8E8E] focus:outline-none focus:border-[#FF9B50]";

  if (isLoading) {
    return <div className="p-4 text-center">로딩중...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!bakeryInfo) {
    return <div className="p-4 text-center">가게 정보를 찾을 수 없습니다.</div>;
  }

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
            name="name"
            value={formData.name}
            onChange={handleInputChange}
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
            name="description"
            value={formData.description}
            onChange={handleInputChange}
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
              name="addressRoad"
              value={formData.addressRoad}
              onChange={handleInputChange}
              className={inputClassName}
            />
            <input
              type="text"
              name="addressDetail"
              value={formData.addressDetail}
              onChange={handleInputChange}
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
              name="bakeryImageUrl"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div className="flex justify-center">
              <div className="relative">
                <button 
                  type="button" 
                  name="bakeryImageUrl"
                  onClick={handleProfileImageClick}
                  className="w-[120px] h-[120px] border border-[#EFEFEF] rounded-[8px] flex items-center justify-center overflow-hidden"
                >
                  {formData.bakeryImageUrl ? (
                    <img 
                      src={formData.bakeryImageUrl} 
                      alt="가게 프로필 이미지 미리보기" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-6 h-6 text-[#8E8E8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
                {formData.bakeryImageUrl && (
                  <button
                    type="button"
                    name="bakeryImageUrl"
                    onClick={() => handleDeleteImage("bakeryImageUrl")}
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
              name="bakeryBackgroundImgUrl"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div className="relative">
              <button 
                type="button" 
                name="bakeryBackgroundImgUrl"
                onClick={handleImageClick}
                className="w-full h-[200px] border border-[#EFEFEF] rounded-[8px] flex items-center justify-center overflow-hidden"
              >
                {formData.bakeryBackgroundImgUrl ? (
                  <img 
                    src={formData.bakeryBackgroundImgUrl} 
                    alt="가게 대표 이미지 미리보기" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-6 h-6 text-[#8E8E8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              {formData.bakeryBackgroundImgUrl && (
                <button
                  type="button"
                  name="bakeryBackgroundImgUrl"
                  onClick={() => handleDeleteImage("bakeryBackgroundImgUrl")}
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