import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { getUserInfo, updateUserInfo, updatePassword, UserInfo } from '../../../../api/user/user';

export function UserEditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // 회원 정보 폼 상태
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    addressRoad: string;
    addressDetail: string;
    currentPassword: string;
    newPassword: string;
  }>({
    name: '',
    email: '',
    phone: '',
    addressRoad: '',
    addressDetail: '',
    currentPassword: '',
    newPassword: '',
  });

  // 컴포넌트 마운트 시 사용자 정보를 불러옴
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user: UserInfo = await getUserInfo();
        setFormData({
          name: user.name,
          email: user.email,
          phone: user.phone,
          addressRoad: user.addressRoad || '',
          addressDetail: user.addressDetail || '',
          currentPassword: '',
          newPassword: '',
        });
      } catch (err: any) {
        setError('사용자 정보를 불러오는데 실패했습니다.');
      }
    };
    fetchUser();
  }, []);

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 폼 전송 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // 사용자 기본 정보 업데이트
      await updateUserInfo({
        name: formData.name,
        phone: formData.phone,
        addressRoad: formData.addressRoad,
        addressDetail: formData.addressDetail,
      });

      // 비밀번호 변경 요청이 있으면 실행 (두 개의 필드 모두 입력되어야 함)
      if (formData.currentPassword && formData.newPassword) {
        await updatePassword({
          originPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        });
      }

      alert('회원 정보가 성공적으로 업데이트되었습니다.');
      navigate(-1);
    } catch (err: any) {
      setError(err.message || '회원 정보 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-5 relative border-b border-gray-100">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold absolute left-1/2 -translate-x-1/2 text-[#333333]">회원정보 수정</h1>
        <div className="w-6" />
      </div>

      {error && (
        <div className="text-red-500 text-center my-2">
          {error}
        </div>
      )}

      {/* 회원정보 수정 폼 */}
      <form onSubmit={handleSubmit} className="p-5 space-y-6">
        {/* 이름 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">이름</label>
          <input 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-xl"
          />
        </div>

        {/* 이메일 (읽기전용) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">이메일</label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full p-2 border rounded-xl bg-gray-100"
          />
        </div>

        {/* 전화번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">전화번호</label>
          <input 
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-xl"
          />
        </div>

        {/* 주소(도로명) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">주소(도로명)</label>
          <input 
            type="text"
            name="addressRoad"
            value={formData.addressRoad}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-xl"
          />
        </div>

        {/* 상세주소 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">상세주소</label>
          <input 
            type="text"
            name="addressDetail"
            value={formData.addressDetail}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-xl"
          />
        </div>

        {/* 비밀번호 변경 섹션 */}
        <div className="mt-4">
          <h2 className="text-lg font-bold">비밀번호 변경</h2>
          <p className="text-sm text-gray-500">변경하시려면 현재 비밀번호와 새 비밀번호를 입력하세요.</p>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">현재 비밀번호</label>
            <input 
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-xl"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">새 비밀번호</label>
            <input 
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-xl "
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="fixed bottom-5 left-0 right-0 max-w-[400px] mx-auto w-full py-3 bg-[#FC973B] text-white font-semibold rounded-xl hover:bg-[#FC973B]/80"
        >
          {loading ? '업데이트 중...' : '저장하기'}
        </button>
      </form>
    </div>
  );
}