import { useState, useRef, useEffect } from 'react';
import { IoEyeOutline, IoEyeOffOutline, IoTrashOutline } from 'react-icons/io5';
import { SubmitButton } from '../../../common/form/SubmitButton';
import { useProfile } from '../../../common/context/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { ProfileSectionProps } from '../../../types/owner';
import { profileEditApi } from '../../../api/user/user';

interface ProfileFormProps {
  userInfo: ProfileSectionProps['userInfo'];
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  profileImage: string | null;
  currentPassword: string;
  newPassword: string;
}

export function ProfileForm({ userInfo }: ProfileFormProps) {
  // const { phoneNumber, handleChange } = usePhoneNumber();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { updateProfile } = useProfile();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    profileImage: null,
    currentPassword: '',
    newPassword: '',
  });
  const [nameError, setNameError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      setFormData(prev => ({
        ...prev,
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        profileImage: userInfo.profilePhotoUrl,
      }));
    }
  }, [userInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'name') {
      setNameError(!value.trim() ? '이름을 입력해주세요.' : '');
    }

    if (name === 'newPassword') {
      setPasswordError(validatePassword(value));
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }));
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
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: null
    }));
  };

  const validatePassword = (password: string) => {
    if (password.length < 10) return '비밀번호는 10자리 이상이어야 합니다.';
    if (!/[a-zA-Z]/.test(password)) return '영문을 포함해야 합니다.';
    if (!/[!@#$%^&*]/.test(password)) return '특수문자(!@#$%^&*)를 포함해야 합니다.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setNameError('이름을 입력해주세요.');
      return;
    }

    // 비밀번호 변경 시 유효성 검사 추가
    if (formData.newPassword || formData.currentPassword) {
      // 둘 중 하나만 입력된 경우 체크
      if (!formData.currentPassword) {
        alert('현재 비밀번호를 입력해주세요.');
        return;
      }
      if (!formData.newPassword) {
        alert('새 비밀번호를 입력해주세요.');
        return;
      }

      // 새 비밀번호 유효성 검사
      const passwordValidation = validatePassword(formData.newPassword);
      if (passwordValidation) {
        setPasswordError(passwordValidation);
        return;
      }
    }

    try {
      const updateData = {
          name: formData.name,
          phone: formData.phone,
      };

      let profileImageFile: File | undefined = undefined;

      if (formData.profileImage && typeof formData.profileImage === "string") {
          const res = await fetch(formData.profileImage);
          const blob = await res.blob();
          profileImageFile = new File([blob], "profile.jpg", { type: blob.type });
      }

      await profileEditApi.updateUserProfile(updateData, profileImageFile);

      updateProfile({
          name: formData.name,
          profileImage: formData.profileImage,
      });

      navigate('/owner/mypage');
  } catch (error) {
      console.error('회원정보 수정 실패:', error);
      alert('회원정보 수정에 실패했습니다.');
  }
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
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="ex) 서유민"
          className={`${inputClassName} ${nameError ? 'border-red-500' : ''}`}
        />
        {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
      </div>

      {/* 이메일 입력 */}
      <div className="space-y-2">
        <label className="block text-sm">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="ex) example@example.com"
          className={`${inputClassName} bg-gray-100 cursor-not-allowed`}
          disabled
        />
      </div>

      {/* 전화번호 입력 */}
      <div className="space-y-2">
        <label className="block text-sm">전화번호</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
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
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-[100px] border border-[#EFEFEF] rounded-[8px] flex items-center justify-center overflow-hidden"
          >
            {formData.profileImage ? (
              <img 
                src={formData.profileImage} 
                alt="프로필 미리보기" 
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-6 h-6 text-[#8E8E8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </button>
          {formData.profileImage && (
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
            value={formData.currentPassword}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              currentPassword: e.target.value
            }))}
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
              value={formData.newPassword}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  newPassword: e.target.value
                }));
                setPasswordError(validatePassword(e.target.value));
              }}
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
          {passwordError ? (
            <p className="text-sm text-red-500 mt-1">{passwordError}</p>
          ) : (
            <p className="text-xs text-[#8E8E8E] mt-1">
              10자 이상, 영문, 특수문자(!@#$%^&*) 포함
            </p>
          )}
        </div>
      </div>

      <SubmitButton
        text="수정"
        className="mt-8"
        type="submit"
      />
    </form>
  );
}
