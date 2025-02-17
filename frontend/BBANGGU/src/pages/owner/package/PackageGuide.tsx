import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { getUserInfo } from '../../../api/user/user';
import { setUserInfo, clearUserInfo } from '../../../store/slices/userSlice';
import { logout } from '../../../store/slices/authSlice';
import { setLoading } from '../../../store/slices/packageSlice';
import { SubmitButton } from '../../../common/form/SubmitButton';
import cameraExample from '@/assets/images/bakery/camera_ex.png';
import ProgressBar from './components/Progress.Bar';
import { PACKAGE_STEPS, TOTAL_PACKAGE_STEPS } from './constants/PakageSteps';
import Header from '../../../components/owner/header/Header';
import axios from 'axios';

const PackageGuide: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bakeryId, setBakeryId] = useState<number | null>(null);
  
  // Redux에서 auth 상태 가져오기
  const { accessToken } = useSelector((state: RootState) => state.auth);

  // 권한 체크 및 유저 정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        const data = await getUserInfo();
        dispatch(setUserInfo({
          name: data.name,
          profileImageUrl: data.profileImageUrl,
          email: data.email,
          phone: data.phone,
          userId: data.userId,
          role: data.role as 'OWNER' | 'USER',
          addressRoad: data.addressRoad,
          addressDetail: data.addressDetail,
          bakeryId: data.bakeryId
        }));

        // 점주가 아닌 경우 메인으로 리다이렉트
        if (data.role !== 'OWNER') {
          dispatch(logout());
          dispatch(clearUserInfo());
          navigate('/');
          return;
        }

        setBakeryId(data.bakeryId);
      } catch (error) {
        console.error('Error fetching user info:', error);
        dispatch(logout());
        dispatch(clearUserInfo());
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [dispatch, navigate, accessToken]);


  // 이미지 캡쳐 및 분석 처리
  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && bakeryId) {
      try {
        dispatch(setLoading(true));
        const compressedFile = await compressImage(file);
        
        const formData = new FormData();
        formData.append('images', compressedFile);
        formData.append('bakeryId', bakeryId.toString());

        // 인증 토큰과 함께 요청
        const response = await axios.post(
          'https://i12d102.p.ssafy.io/ai/detectcrop',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${accessToken}` // 인증 토큰 추가
            },
            withCredentials: false // withCredentials를 false로 변경
          }
        );

        // 응답 구조에 맞게 데이터 처리
        const result = response.data;
        if (Array.isArray(result) && result.length >= 2) {
          navigate('/owner/package/preview', { 
            state: { analyzedItems: result } 
          });
        } else {
          throw new Error('Invalid response format');
        }

      } catch (error) {
        console.error('에러:', error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 500) {
            alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          } else if (error.response?.status === 413) {
            alert('이미지 크기가 너무 큽니다. 다시 시도해주세요.');
          } else if (error.response?.status === 401) {
            alert('인증이 필요합니다. 다시 로그인해주세요.');
            navigate('/login');
          } else {
            alert('이미지 분석 중 오류가 발생했습니다.');
          }
        }
      } finally {
        dispatch(setLoading(false));
      }
    } else if (!bakeryId) {
      alert('베이커리 정보를 찾을 수 없습니다.');
    }
  };

  // 이미지 압축 함수
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1024;  // 최대 너비
          const MAX_HEIGHT = 1024; // 최대 높이
          let width = img.width;
          let height = img.height;

          // 비율 유지하면서 크기 조정
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // 압축된 이미지를 Blob으로 변환
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('이미지 압축 실패'));
            }
          }, 'image/jpeg', 0.7);  // 품질 0.7로 압축
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        title="촬영 가이드" 
        onBack={() => navigate(-1)}
      />
      
      <div className="mt-4">
        <ProgressBar 
          currentStep={PACKAGE_STEPS.GUIDE} 
          totalSteps={TOTAL_PACKAGE_STEPS}
        />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        {/* 설명 텍스트 */}
        <div className="mt-4 text-center">
          <p className="text-base text-gray-600">
            예시와 같이 촬영해주세요
          </p>
          <p className="text-[18px] font-bold text-gray-600">
            빵구 AI가 자동으로 빵의 제고와 가격을 파악합니다!
          </p>
        </div>

        {/* AI 분석 예시 이미지 */}
        <div className="mt-6 flex justify-center">
          <img 
            src={cameraExample} 
            alt="카메라 사용 예시" 
            className="w-[300px] rounded-lg mb-4"
          />
        </div>

        {/* 촬영 가이드라인 */}
        <div className="mt-6 space-y-4 pl-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FC973B] flex items-center justify-center text-white">1</div>
            <p className="text-gray-700">빵을 트레이에 잘 정렬해주세요</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FC973B] flex items-center justify-center text-white">2</div>
            <p className="text-gray-700">빵이 겹치지 않도록 간격을 두세요</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FC973B] flex items-center justify-center text-white">3</div>
            <p className="text-gray-700">전체 트레이가 잘 보이게 촬영해주세요</p>
          </div>
        </div>

        {/* 카메라 input 추가 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCapture}
          className="hidden"
        />

        {/* 하단 버튼 */}
        <div className="mt-auto pt-4">
          <SubmitButton
            text={<span className="font-bold">재고 찍으러 가기</span>}
            onClick={() => fileInputRef.current?.click()}  // 버튼 클릭시 바로 카메라 열기
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PackageGuide; 