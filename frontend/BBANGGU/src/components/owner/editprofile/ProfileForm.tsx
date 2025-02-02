import { useState, useRef } from 'react';
import { IoEyeOutline, IoEyeOffOutline, IoTrashOutline } from 'react-icons/io5';
import { usePhoneNumber } from '../../../hooks/usePhoneNumber';
import { SubmitButton } from '../../../common/form/SubmitButton';
import { useProfile } from '../../../common/context/ProfileContext';
import { useNavigate } from 'react-router-dom';

export function ProfileForm() {
  const { phoneNumber, handleChange } = usePhoneNumber();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { profile, updateProfile } = useProfile();
  const [name, setName] = useState(profile.name);
  const [nameError, setNameError] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(profile.profileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 이름 유효성 검사
    if (!name.trim()) {
      setNameError('이름을 입력해주세요.');
      return;
    }

    updateProfile({
      name,
      profileImage
    });
    navigate('/owner/mypage');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (!value.trim()) {
      setNameError('이름을 입력해주세요.');
    } else {
      setNameError('');
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (예: 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // 이미지 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setProfileImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
  };

  // 비밀번호 유효성 검사 함수 수정
  const validatePassword = (password: string) => {
    if (password.length < 10) {
      return '비밀번호는 10자리 이상이어야 합니다.';
    }
    if (!/[a-zA-Z]/.test(password)) {
      return '영문을 포함해야 합니다.';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return '특수문자(!@#$%^&*)를 포함해야 합니다.';
    }
    return '';
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setNewPassword(newValue);
    setPasswordError(validatePassword(newValue));
  };

  const inputClassName = "w-full px-4 py-3 rounded-[8px] border border-[#EFEFEF] placeholder-[#8E8E8E] focus:outline-none focus:border-[#FF9B50]";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {/* 이름 입력 */}
      <div className="space-y-2">
        <label className="block text-sm">
          이름
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="ex) 서유민"
          className={`${inputClassName} ${
            nameError ? 'border-red-500 focus:border-red-500' : ''
          }`}
        />
        {nameError && (
          <p className="text-sm text-red-500 mt-1">{nameError}</p>
        )}
      </div>

      {/* 이메일 입력 */}
      <div className="space-y-2">
        <label className="block text-sm">Email</label>
        <input
          type="email"
          placeholder="ex) example@example.com"
          className={inputClassName}
        />
      </div>

      {/* 전화번호 입력 */}
      <div className="space-y-2">
        <label className="block text-sm">전화번호</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={handleChange}
          placeholder="ex) 010-0000-0000"
          className={inputClassName}
          maxLength={13}
        />
      </div>

      {/* 프로필 사진 */}
      <div className="space-y-2">
        <label className="block text-sm">프로필 사진</label>
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
            className="w-full h-[100px] border border-[#EFEFEF] rounded-[8px] flex items-center justify-center overflow-hidden"
          >
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="프로필 미리보기" 
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
              onClick={handleDeleteImage}
              className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
            >
              <IoTrashOutline className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 비밀번호 변경 섹션 */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium">비밀번호 변경</h2>
        
        {/* 현재 비밀번호 */}
        <div className="relative">
          <input
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호 입력"
            className={inputClassName}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showCurrentPassword ? (
              <IoEyeOutline className="w-5 h-5 text-[#8E8E8E]" />
            ) : (
              <IoEyeOffOutline className="w-5 h-5 text-[#8E8E8E]" />
            )}
          </button>
        </div>

        {/* 새 비밀번호 */}
        <div className="space-y-1">
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="새 비밀번호 입력"
              className={`${inputClassName} ${passwordError ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showNewPassword ? (
                <IoEyeOutline className="w-5 h-5 text-[#8E8E8E]" />
              ) : (
                <IoEyeOffOutline className="w-5 h-5 text-[#8E8E8E]" />
              )}
            </button>
          </div>
          {passwordError && (
            <p className="text-sm text-red-500 mt-1">{passwordError}</p>
          )}
          <p className="text-xs text-[#8E8E8E] mt-1">
            10자 이상, 영문, 특수문자(!@#$%^&*) 포함
          </p>
        </div>
      </div>

      <SubmitButton
        text="수정"
        className="mt-8"
      />
    </form>
  );
}